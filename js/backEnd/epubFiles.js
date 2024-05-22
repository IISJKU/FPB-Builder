const path = require("path");

let fs = require("fs");

let language;

function setLanguage(lang) {
  language = lang;
}

let title = "";

let pubISBN = "";
let originalISBN = "CHANGETHIS";
let authors = [];
let publisher = "";
let copyright = "";
let description = "";
let contributors = [];
let options = [];

let date = new Date().toISOString();
let dateText = date.substring(0, date.indexOf(".")) + "Z";
let coverImage = "";

function setMetadata(metadata) {
  title = metadata.title[language];
  pubISBN = metadata.identifier[language];
  authors = metadata.authors;
  publisher = metadata.publisher;
  copyright = metadata.copyright;
  date = new Date().toISOString();
  dateText = date.substring(0, date.indexOf(".")) + "Z";
  description = metadata.description[language];
  contributors = metadata.contributors;
}

function setOptions(opt) {
  options = opt;
}

function setCover(cover) {
  coverImage = "images/" + cover.substring(cover.lastIndexOf("\\") + 1, cover.length);
}

//this is a string of the container file used in the epub, it is usually saved under /META-INF
const containerFileXML =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
  '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n' +
  "   <rootfiles>\n" +
  '		<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />\n' +
  "	</rootfiles>\n" +
  "</container>\n";

const iBooksOptions =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  "<display_options>\n" +
  '<platform name="*">\n' +
  '<option name="specified-fonts">true</option>\n' +
  "</platform>\n" +
  "</display_options>";

function MenuItem(name, src) {
  this.name = name;
  this.src = src;
}

let menuItems = [
  new MenuItem("Einstellungen", "xhtml/page00.xhtml#toc-epubtools-22"),
  new MenuItem('Anleitung zu "' + title + '"', "xhtml/notice_toc.xhtml#toc-epubtools-3"),
  new MenuItem("Inhaltsverzeichnis", "xhtml/notice_toc.xhtml#toc-epubtools-16"),
  new MenuItem("Menü", "xhtml/notice.xhtml#toc-epubtools-5"),
  new MenuItem("Textmenü", "xhtml/notice.xhtml#toc-epubtools-6"),
  new MenuItem("Menü Abbildungen", "xhtml/notice.xhtml#toc-epubtools-7"),
  new MenuItem("Audio-Menü", "xhtml/notice.xhtml#toc-epubtools-8"),
  new MenuItem("Während des Lesens", "xhtml/notice.xhtml#toc-epubtools-9"),
  new MenuItem("IMPRESSUM", "xhtml/credits.xhtml#toc-epubtools-1"),
  new MenuItem("Inhaltsverzeichnis", "xhtml/toc.xhtml#toc-epubtools-26"),
];

//prettier-ignore
function createTOC() {
  let fileContents =
    "<?xml version='1.0' encoding='utf-8'?>\n" +
    '<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">\n' +
    "  <head>\n" +
    '    <meta name="dtb:uid" content="urn:isbn:' + pubISBN + '"/>\n' +
    '    <meta name="dtb:depth" content="1"/>\n' +
    '    <meta name="dtb:totalPageCount" content="0"/>\n' +
    '    <meta name="dtb:maxPageNumber" content="0"/>\n' +
    "  </head>\n" +
    "  <docTitle>\n" +
    "    <text>" + title + "</text>\n" +
    "  </docTitle>\n" +
    "<navMap>\n\n";

  navLabels = "";
  let i = 0;

  let mItems = menuItems;

  if(!options.includeInstructions) mItems = mItems.splice(1,1);

  mItems.forEach((item) => {
    
    let nav =
      '<navPoint id="navPoint' + i + '" playOrder="' + i + '">\n' +
      "<navLabel>\n" +
      "<text>" + item.name + "</text>\n" +
      "</navLabel>\n" +
      '<content src="' + item.src + '" /></navPoint>\n\n';
    fileContents = fileContents + nav;

    i++;
  });

  fileContents = fileContents + "</navMap>\n";
  fileContents = fileContents + "</ncx>\n";

  return fileContents;
}

function createContentFile(files, spineFiles) {
  let header =
    "<?xml version='1.0' encoding='utf-8'?>\n" +
    '<package xmlns="http://www.idpf.org/2007/opf" prefix="ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/ rendition: http://www.idpf.org/vocab/rendition/#" version="3.0" unique-identifier="pub-id" xml:lang="' +
    language +
    '">\n';
  let startMetadataTag =
    '  <metadata xmlns:opf="http://www.idpf.org/2007/opf" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:ibooks="http://apple.com/ibooks/html-extensions">\n\n';
  let endPackageTag = "</package>";

  let metaDataContents =
    '   <dc:language id="pub-langage">' +
    language +
    "</dc:language>\n" +
    '   <dc:identifier id="pub-id">urn:isbn:' +
    pubISBN +
    "</dc:identifier>\n" +
    '   <dc:source id="src-id">urn:isbn:' +
    originalISBN +
    "</dc:source>\n" +
    "\n" +
    '   <dc:title id="titre">' +
    title +
    "</dc:title>\n" + //Here, id-tags are used: look into, whether or not we should replace them dynamically
    '   <meta refines="#titre" property="title-type">main</meta>\n' +
    "\n";

  authors.forEach((author) => {
    metaDataContents =
      metaDataContents +
      '   <dc:creator id="' +
      author.replaceAll(" ", "-") +
      '">' +
      author +
      "</dc:creator>\n" +
      '   <meta property="role" refines="#' +
      author.replaceAll(" ", "-") +
      '" scheme="marc:relators">aut</meta>\n' +
      '   <meta property="file-as" refines="#' +
      author.replaceAll(" ", "-") +
      '">' +
      author +
      "</meta>\n" +
      "\n";
  });

  metaDataContents =
    metaDataContents +
    '   <meta property="rendition:flow">scrolled-doc</meta>\n' +
    '   <meta property="rendition:layout">reflowable</meta>\n' +
    '   <meta property="rendition:orientation">portrait</meta>\n' +
    '   <meta property="rendition:spread">none</meta>\n' +
    "\n" +
    "\n";

  if (publisher != undefined && publisher.length > 0) metaDataContents = metaDataContents + "   <dc:publisher>" + publisher + "</dc:publisher>\n";

  if (copyright != undefined && copyright.length > 0) metaDataContents = metaDataContents + "   <dc:rights>Copyright ©" + copyright + "</dc:rights>\n";

  metaDataContents = metaDataContents + "   <dc:date>" + dateText + "</dc:date>\n" + '   <meta property="dcterms:modified">' + dateText + "</meta>\n";
  if (description != undefined && description.length > 0)
    ' metaDataContents = metaDataContents +    <dc:description id="description">' + description + "</dc:description>\n";

  contributors.forEach((contributor) => {
    metaDataContents =
      metaDataContents +
      '   <dc:contributor id="' +
      contributor.replaceAll(" ", "-") +
      '">' +
      contributor +
      '"</dc:contributor>\n' +
      '   <meta scheme="marc:relators" property="role" refines="#' +
      contributor.replaceAll(" ", "-") +
      '">mrk</meta>\n' +
      '   <meta scheme="marc:relators" property="role" refines="#' +
      contributor.replaceAll(" ", "-") +
      '">prg</meta>\n' +
      '   <meta refines="#' +
      contributor.replaceAll(" ", "-") +
      '" property="file-as">' +
      contributor +
      "</meta>\n";
  });

  metaDataContents =
    metaDataContents +
    "\n" +
    '   <meta name="cover" content="' +
    coverImage +
    '"/>\n' +
    '   <meta property="ibooks:specified-fonts">true</meta>\n' +
    "\n" +
    '   <meta property="schema:accessMode">textual</meta>\n' +
    '   <meta property="schema:accessMode">visual</meta>\n' +
    '   <meta property="schema:accessModeSufficient">visual</meta>\n' +
    '   <meta property="schema:accessModeSufficient">textual</meta>\n' +
    '   <meta property="schema:accessibilityFeature">alternativeText</meta>\n' +
    '   <meta property="schema:accessibilityFeature">structuralNavigation</meta>\n' +
    '   <meta property="schema:accessibilityFeature">displayTransformability</meta>\n' +
    '   <meta property="schema:accessibilityFeature">printPageNumbers</meta>\n' +
    '   <meta property="schema:accessibilityHazard">sound</meta>\n' +
    '   <meta property="schema:accessibilityAPI">ARIA</meta>\n' +
    '   <meta property="schema:accessibilitySummary">Les illustrations sont décrites.</meta>\n'; // translate this

  let closeMetadata = "  </metadata>\n\n";
  let metaData = startMetadataTag + metaDataContents + closeMetadata;

  //here, stuff from the "files"-array will be written to the file
  let startManifestTag = "  <manifest>\n";
  let importedItems = "";
  let spineContents = "";

  let handledFiles = [];

  files.forEach((filename) => {
    let line = "";
    let name = filename.substring(filename.lastIndexOf("\\") + 1, filename.length);

    if (filename.includes("/")) {
      name = filename.substring(filename.lastIndexOf("/") + 1, filename.length);
    }

    if (filename.includes(".css")) {
      line = '   <item id="' + name + '" href="css/' + name + '" media-type="text/css" />';
    } else if (filename.includes(".js")) {
      line = '   <item id="' + name + '" href="Misc/' + name + '" media-type="application/javascript" />';
    } else if (filename.includes(".otf") || filename.includes(".ttf")) {
      line = '   <item id="' + name + '" href="fonts/' + name + '" media-type="application/vnd.ms-opentype" />';
    } else if (filename.includes(".mp3")) {
      line = '   <item id="' + name + '" href="audio/' + name + '" media-type="audio/mpeg" />';
    } else if (filename.includes(".jpg")) {
      if (filename.includes("/notice")) line = '   <item id="' + name + '" href="images/notice/' + name + '" media-type="image/jpeg" />';
      else if (coverImage.includes(name)) {
        line = '   <item id="' + name + '" href="images/' + name + '" media-type="image/jpeg" properties="cover-image" />';
      } else line = '   <item id="' + name + '" href="images/' + name + '" media-type="image/jpeg" />';
    } else if (filename.includes(".png")) {
      if (filename.includes("/notice")) line = '   <item id="' + name + '" href="images/notice/' + name + '" media-type="image/png" />';
      else line = '   <item id="' + name + '" href="images/' + name + '" media-type="image/png" />';
    } else if (filename.includes(".svg")) {
      line = '   <item id="' + name + '" href="images/notice/' + name + '" media-type="image/svg+xml" />';
    }

    if (!importedItems.includes(line)) {
      importedItems = importedItems + line + "\n";
    }
  });

  spineFiles.forEach((filename) => {
    let line = "";
    let name = filename.substring(filename.lastIndexOf("\\") + 1, filename.length);
    let properties = "scripted svg";
    if (filename == "toc.xhtml") properties = "nav";
    if (filename == "cover.xhtml" || filename == "notice_toc.xhtml") properties = "scripted";
    line =
      '   <item id="' +
      name.substring(0, name.indexOf(".")) +
      '" href="xhtml/' +
      name +
      '" media-type="application/xhtml+xml" properties="' +
      properties +
      '" />';
    spineContents = spineContents + '   <itemref idref="' + name.substring(0, name.indexOf(".")) + '"/>' + "\n";
    importedItems = importedItems + line + "\n";
  });

  let additionalImports = '   <item id="toc.ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />\n'; //those are the kind of files that will be in every epub

  let endManifestTag = "  </manifest>\n\n";
  let manifest = startManifestTag + additionalImports + importedItems + endManifestTag;

  let startSpineTag = '  <spine toc="toc.ncx">\n';

  let endSpineTag = "  </spine>\n\n";
  let spine = startSpineTag + spineContents + endSpineTag;

  return header + metaData + manifest + spine + endPackageTag;
}

//this reads page00 from a template,
function createPage00() {
  let str = "";

  str = fs.readFileSync("./js/backEnd/templates/" + language + "/page00.xhtml", "utf-8");
  str = str.replaceAll("{title}", title);

  return str;
}

//this is just a wrapper, to make it more easily accassible
//
// TODO: Make Language Dependent on active one!
//
//
function createNotice() {
  let str = "";

  str = fs.readFileSync("./js/backEnd/templates/" + language + "/notice.xhtml", "utf-8");
  str = str.replaceAll("{title}", title);

  return str;
}

function filterToc(str, argument) {
  let t = str.split("\n");
  let open = false;
  str = "";
  t.forEach((line) => {
    if (line.trim() == argument && !open) {
      open = true;
    } else if (line.trim() == "<!-- manual -->" && open) {
      open = false;
    }

    if (!open) {
      str = str + line + "\n";
    }
  });

  return str;
}

function createTocXHTML(pages) {
  if (pages.length != 0) {
    let str = "";

    str = fs.readFileSync("./js/backEnd/templates/" + language + "/toc.xhtml", "utf-8");

    str = str.replaceAll("{title}", title);

    pagesText = "";

    pages.forEach((page) => {
      pagesText = pagesText + '<li><a href="' + page.title + "-txt.xhtml#" + page.title + '">' + page.title + "</a></li>\n";
    });

    str = str.replaceAll("{pages}", pagesText);

    str = str.replaceAll("{firstpage}", pages[0].title + "-txt.xhtml");

    if (!options.includeInstructions) {
      str = filterToc(str, "<!-- manual -->");
    }

    if (!options.includeBookSettings) {
      str = filterToc(str, "<!-- config -->");
    }

    return str;
  }
}

//add the file that displays the credits
function createCredits(creditPage) {
  let str = "";

  str = fs.readFileSync("./js/backEnd/templates/" + language + "/credits.xhtml", "utf-8");

  /*
  let tempCredits = [
    'Digitaler illustrierter Band aus der Reihe <span lang="fr">Les Doigts Qui Rêvent</span> (Frankreich)',
    "Validierung: pagina EPUB-Checker version 2.0.6 und Ace by DAISY Version 1.1.5",
    'Digitaler Band "Ben will eine Fledermaus", eine in Texten und Abbildungen adaptierte ePub3-Version des Kinderbuchs <span lang="fr">"Émile veut une chauve-souris"</span> von <span lang="fr">Vincent Cuvellier</span> und <span lang="fr">Ronan Badel</span>, erschienen im Verlag <span lang="fr">Gallimard</span>, Frankreich.',
    '<b class="ldqr-font-bold">Gestaltung und Produktion der adaptierten Illustrationen</b> von <span lang="fr">Yuvanoe</span> und <span lang="fr">Anaïs Brard</span> (<span lang="fr">Les Doigts Qui Rêvent</span>, Frankreich)',
    '<b class="ldqr-font-bold">Erzählt von Synchronsprecherin</b> Wanda Dziak',
    '<b class="ldqr-font-bold">Sound-Design</b> (Stimmen, Effekte, Atmo und Tonmischung) des französischen Originals durch <span lang="fr">Ludovic Rocca</span> (<span lang="fr">Benjamin media</span>, Frankreich)',
    '<b class="ldqr-font-bold">Design des digitalen Buchs im französischen Original</b> durch <span lang="fr">Ludovic Bal</span> (<span lang="fr">Réseau Canopé</span> - Frankreich).',
    'Wir danken den Autoren <span lang="fr">Vincent Cuvellier</span> und <span lang="fr">Ronan Badel</span> sowie dem Verlag <span lang="fr">Gallimard</span> für die Erlaubnis, diese Adaption vorzunehmen.',
    "Dieses Projekt wurde im Rahmen von ERASMUS PLUS (Call 2022) der Europäischen Union gefördert. Wir danken für die Unterstützung, ohne die dieses Projekt nicht möglich gewesen wäre.",
    "This is a line of debug code added by Max Punz, to see whether or not this works!",
  ];*/

  let ourCredit = {
    EN: "This EPUB was created with the Flexi Picture EBook Builder, which was developed at the JKU Linz by Danya Gharbieh and Maximilian Punz.",
    DE: "Dieses EPUB wurde mit dem Flexi Picture EBook Builder erstellt, der an der JKU Linz von Danya Gharbieh und Maximilian Punz entwickelt wurde.",
    LIT: 'Šis EPUB buvo sukurtas naudojant "Flexi Picture EBook Builder" programą, kurią JKU sukūrė Danya Gharbieh ir Maximilian Punz.',
    FR: "Cet EPUB a été créé avec le Flexi Picture EBook Builder, développé à la JKU par Danya Gharbieh et Maximilian Punz.",
    IT: "Questo EPUB è stato creato con Flexi Picture EBook Builder, sviluppato alla JKU Linz da Danya Gharbieh e Maximilian Punz.",
  };

  if (creditPage.text[language] != undefined) {
    creditPage.text[language] = creditPage.text[language].trim();
    if (creditPage.text[language].slice(-2) != "\n") {
      creditPage.text[language] += "\n";
    }

    creditPage.text[language] = creditPage.text[language] + ourCredit[language];
    let text = '<p class="isbn">ISBN <span class="tslt_isbn">' + pubISBN + "</span></p>\n";
    let count = 1;

    if (!Array.isArray(creditPage.text[language])) {
      creditPage.text[language] = creditPage.text[language].split("\n");
    }

    creditPage.text[language].forEach((credit) => {
      let t = "";
      if (count < 10) {
        t = "0" + count;
      } else {
        t = count;
      }
      text = text + '        <p class="tsl_sentence' + t + '">' + credit + "</p>\n";
      count = count + 1;
    });

    str = str.replaceAll("{credits}", text);
  }
  return str;
}

//
//
// TODO: Make Language Dependent on active one!
//
function createNoticeToc() {
  let str = "";

  str = fs.readFileSync("./js/backEnd/templates/" + language + "/notice_toc.xhtml", "utf-8");
  str = str.replaceAll("{title}", title);

  return str;
}

//returns the html of the page0X-txt.html files as a string
//this still has to be adapted to be more dynamic
//prettier-ignore
function createPageText(obj){
  let str = "";

  let text = obj.text[language];
  let audio = obj.narration[language];
  let title = obj.title;


  //parses text, and automatically adds propper html tags
  let processedText = "<p>";
  for(let i = 0; i < text.length; i++){
    //this is in a seperate if, to make it safer (against an out of bounds error)
    if(i != 0){
      if(text[i-1] == '\n'){
        processedText = processedText + "<p>";
      }
    }
    if(text[i] == '\n' && i + 1 != text.length){ //the last bit,  i + 1 != text.length, is there to make sure, that the tag will get ignored, if it is the last thing in the text
      processedText = processedText + "</p> ";
    } else {
      processedText = processedText + text[i];
    }
  }
  processedText = processedText + "</p> ";

  //maybe all of these imports arent needed?  

  //generate the text for the pages!
  str = '<?xml version="1.0" encoding="utf-8" standalone="no"?>\n' + 
  '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:ibooks="http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0" epub:prefix="ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0" xml:lang="' + language + '" lang="' + language + '">\n' +
  '\n' +
  '  <head>\n' +
  '    <title>'+ title + '</title>\n' +
  '    <link rel="preload" href="../Misc/localforage.min.js" as="script" type="text/javascript" />\n' +
  '    <link rel="preload" href="../Misc/ldqr.min.js" as="script" type="text/javascript" />\n' +
  '    <link id="mainCss" href="../css/ldqr_main.min.css" rel="stylesheet" type="text/css" />\n' +
  '    <link href="../css/colorisation.css" rel="stylesheet" type="text/css" />\n' +
  '    <script type="text/javascript" src="../Misc/localforage.min.js"></script>\n' +
  '    <script type="text/javascript" src="../Misc/colorisation.min.js" charset="utf-8"></script>\n' +
  '    <script type="text/javascript" src="../Misc/ldqr.min.js" charset="utf-8"></script>\n' +
  '  </head>\n' +
  '\n' +
  '  <body class="body">\n' +
  '    <section class="page" epub:type="chapter" role="doc-chapter">\n';
  
  
  if(options.includeNarrations) 
    str = str + 
  '    <svg id="monAudioPlay" version="1.1" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMinYMin meet" viewBox="0 0 50 66" width="100%" height="50" xml:space="preserve">\n' +
  '      <g id="menuHaut" transform="translate(100,29)">\n' +
  '        <g>\n' +
  '          <line x1="-250" y1="0" x2="750" y2="0"/>\n' +
  '          <circle fill="white" stroke="black" cx="0" cy="0" r="35"/>\n' +
  '          <rect width="1000" height="45" x="-250" y="-45" fill="white" stroke="none"/>\n' +
  '        </g>\n' +
  '        <g id="playAudio" role="button" aria-label="Lancer l animation" class="bouton-surprise">\n' +
  '          <circle fill="black" stroke="black" cx="0" cy="0" r="25"/>\n' +
  '          <g transform="translate(-26,-26)" fill="white" stroke="none">\n' +
  '            <path d="m24.2,1.1c-1.4.1-2.8.4-4.1.7.4.3.6.6.5,1.2,0,.5,0,1,0,1.4-.3,2.2.3,4.1,1.6,5.8,1.8,2.5,3.6,5,5.3,7.5,1.1,1.5.3,3.3-1.4,3.6-.7.2-1.5.3-2.2.5-.9.2-1.1.7-.9,1.6.2.7.4,1.4.6,2.2.4,1.6,0,2.5-1.5,3.2-1.1.6-3.7,1.1-3.5,1.7s1.1.6,1.6.8c.5.3,1,.5,1.5.8,1.2.8,1.4,2.3.5,3.6-.4.7-.6,1.3-.5,2.1.2.9,0,1.7-.5,2.5-.7,1.2-1.9,1.7-3.2,1.8-2.2.2-4.3.3-6.5.5-.9,0-1.5.5-1.8,1.4,0,.1,0,.3-.1.4,5,4.5,11.7,7.1,19,6.4,13.7-1.2,23.9-13.3,22.7-27.1S37.9,0,24.2,1.1Zm5.9,32.7c-.3.4-.7.5-1.2.4-1-.2-1.5-1.3-.9-2.1.4-.6.7-1.2.8-1.9,0-1.1-.3-2-1.2-2.8-.4-.4-.6-.9-.4-1.5.2-.5.6-.8,1.3-.9.2,0,.5.1.8.3,2.5,1.9,2.9,6.2.7,8.5Zm3.9,4.1c-.5-.2-.9-.8-.8-1.4,0-.3.3-.7.5-1,1.5-1.9,2.1-4.1,1.9-6.4-.2-2.5-1.3-4.6-3.1-6.2-.7-.6-.8-1.4-.2-2,.5-.6,1.4-.6,2,0,2.4,2.1,3.7,4.8,4.1,8.4,0,.5,0,1.3-.1,2.2-.3,2.3-1.2,4.3-2.6,6.1-.4.5-1,.7-1.6.4Zm7,3.2c-.5.6-1.3.7-1.9.2-.6-.5-.7-1.3-.2-1.9.1-.1.2-.3.3-.4,3-3.9,3.8-8.3,2.6-13.1-.8-3-2.4-5.4-4.7-7.5-.7-.6-.8-1.4-.2-2,.5-.6,1.4-.6,2,0,3.6,3.1,5.6,7.1,6.1,11.4.2,2.4,0,4.3-.4,6.1-.6,2.7-1.8,5-3.6,7.1Z"/>' +
  '          </g>\n' +
  '          <circle fill="none" stroke="black" cx="0" cy="0" r="25"/>\n' +
  '        </g>\n' +
  '        <g id="pauseAudio" role="button" aria-label="Mettre sur pause" class="bouton-surprise notDisplay" aria-hidden="true">\n' +
  '          <circle fill="white" stroke="black" cx="0" cy="0" r="25"/>\n' +
  '          <rect width="10" height="30" x="-15" y="-15" fill="black" stroke="none"/>\n' +
  '          <rect width="10" height="30" x="5" y="-15" fill="black" stroke="none"/>\n' +
  '        </g>\n' +
  '      </g>\n' +
  '    </svg>\n'+
  '    <audio preload="auto" id="monTexteAudio">\n' +
  '      <source src="../audio/' + audio.substring(audio.lastIndexOf("\\")+1, audio.length) + '" type="audio/mpeg" />\n' +
  '    </audio>\n';

  str = str +
  '      <section id="monTexte" class="section-texte ldqr-font-luciole ldqr-font-bold">\n' +
  '       <span epub:type="pagebreak" id="'+ title + '" aria-label="' + title + '" role="doc-pagebreak"></span>\n' +
  '       <div class="texte">'+ processedText + '</div>\n' +
  '         <button id="playTexteSr" aria-labelledby="label" class="screen-reader bouton-surprise">\n' +
  '          <span id="label" class="tslt_ecouter_texte">anhören</span>\n' +
  '        </button>\n' +
  '      </section>\n' +
  '    </section>\n' +
  '  </body>\n' +
  '</html>\n';


  return str;
}

//prettier-ignore
function createCover(title, cover, altText, audio){
  if(audio == undefined || audio == null ){
    audio = "";
  }
  let str = 
  '<?xml version="1.0" encoding="utf-8" standalone="no"?>\n' +
  '<html xmlns:epub="http://www.idpf.org/2007/ops" xmlns="http://www.w3.org/1999/xhtml" xml:lang="de" lang="de">\n' +
  '<head>\n' +
  '  <title class="tslt_couverture">' + title + '</title>\n' +
  '  <link rel="preload" href="../Misc/localforage.min.js" as="script" type="text/javascript" />\n' +
  '  <link rel="preload" href="../Misc/ldqr.min.js" as="script" type="text/javascript" />\n' +
  '  <link id="mainCss" href="../css/ldqr_main.min.css" rel="stylesheet" type="text/css" />\n' +
  '  <script type="text/javascript" src="../Misc/localforage.min.js"></script>\n' +
  '  <script type="text/javascript" src="../Misc/ldqr.min.js" charset="utf-8"></script>\n' +
  '<style>\n' +
  '  body,html{\n' +
  '    height: 98vh;\n' +
  '  }\n' +
  '</style>\n' +
  '</head>\n\n' +
  '<body>\n' +
  '  <audio preload="auto" id="monTexteAudio">\n' +
  '    <source src="../audio/' + audio.substring(audio.lastIndexOf("\\") + 1, audio.length) +'" type="audio/mpeg">\n' +
  '    </source>\n' +
  '  </audio>\n' +
  '  <div style="text-align: center; height: 100%">\n' +
  '    <img epub:type="cover" role="doc-cover" class="alt_sentence0" src="../images/' + cover.substring(cover.lastIndexOf("\\") + 1, cover.length) + '" alt="' + altText +'" style="max-width: 100%; max-height: 100%" />\n' +
  '  </div>\n' +
  '  <button id="playTexteSr" aria-labelledby="label" class="screen-reader bouton-surprise">\n' +
  '    <span id="label" class="tslt_ecouter_texte">anhören</span>\n' +
  '  </button>\n' +
  '</body>\n' +
  '</html>\n';

  return str;
}

exports.setOptions = setOptions;
exports.setLanguage = setLanguage;
exports.setCover = setCover;
exports.createPage00 = createPage00;
exports.createCredits = createCredits;
exports.createNoticeToc = createNoticeToc;
exports.createCover = createCover;
exports.containerFile = containerFileXML;
exports.iBooksOptions = iBooksOptions;
exports.createPageText = createPageText;
exports.createContentFile = createContentFile;
exports.createNotice = createNotice;
exports.createTOC = createTOC;
exports.createTocXHTML = createTocXHTML;
exports.setMetadata = setMetadata;
