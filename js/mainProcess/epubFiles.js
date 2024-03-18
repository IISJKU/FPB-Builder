const path = require("path");

let fs = require("fs");
const { title } = require("process");

//THIS IS FAKE-DATA FOR TESTING PURPOSES
//later this info will come from the frontend
//add posibility for multiple authors / contributors
let bookTitle = "Ben will eine Fledermaus.";
let language = "de"; //look into the possible languages & create an enum containing all of the possible values
let pubISBN = "isbn:978-2-36593-153-3";
let originalISBN = "isbn:978-2-07064-424-7";
let author1 = "Les doigts qui rêvent";
let publisher = "LDQR";
let copyright = "2022 LDQR";
let date = new Date().toISOString();
let description = "This is the description adsdfgdfhgfhgfhf";
let contributorFirstname1 = "Pax";
let contributorLastname1 = "Munz";
let contributor1ID = "contributor1";

let coverImage = "images/cover.jpg";

//this is a string of the container file used in the epub, it is usually saved under /META-INF
const containerFileXML =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
  '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n' +
  "   <rootfiles>\n" +
  '		<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />\n' +
  "	</rootfiles>\n" +
  "</container>\n";

function MenuItem(name, src) {
  this.name = name;
  this.src = src;
}

let menuItems = [
  new MenuItem('Anleitung zu "' + bookTitle + '"', "xhtml/page00.xhtml#toc-epubtools-22"),
  new MenuItem('Anleitung zu "' + bookTitle + '"', "xhtml/notice_toc.xhtml#toc-epubtools-3"),
  new MenuItem("Inhaltsverzeichnis", "xhtml/notice_toc.xhtml#toc-epubtools-16"),
  new MenuItem("Menü", "xhtml/notice.xhtml#toc-epubtools-5"),
  new MenuItem("Textmenü", "xhtml/notice.xhtml#toc-epubtools-6"),
  new MenuItem("Menü Abbildungen", "xhtml/notice.xhtml#toc-epubtools-7"),
  new MenuItem("Audio-Menü", "xhtml/notice.xhtml#toc-epubtools-8"),
  new MenuItem("Während des Lesens", "xhtml/notice.xhtml#toc-epubtools-9"),
  new MenuItem("IMPRESSUM<", "xhtml/credits.xhtml#toc-epubtools-1"),
  new MenuItem("Inhaltsverzeichnis", "xhtml/toc.xhtml#toc-epubtools-26"),
];

//TODO
//Actually write this
//prettier-ignore
function createTOC() {
  let fileContents =
    "<?xml version='1.0' encoding='utf-8'?>\n" +
    '<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">\n' +
    "  <head>\n" +
    '    <meta name="dtb:uid" content="urn:isbn:978-2-36593-153-3"/>\n' +
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

  menuItems.forEach((item) => {
    let nav =
      '<content src="' + item.src + '" /></navPoint>\n' +
      '<navPoint id="navPoint' + i +
      '" playOrder="' + i + '">\n' +
      "<navLabel>\n" +
      "<text>" + item.name + "</text>\n" +
      "</navLabel>\n\n";

    fileContents = fileContents + nav;

    i++;
  });

  fileContents = fileContents + "</navMap>\n";
  fileContents = fileContents + "</ncx>\n";

  return fileContents;
}

//TODO
//Actually write this
//dynamically creates the xml inside the content.txt file!

// prettier-ignore
function createContentFile(files) {
  let header = "<?xml version='1.0' encoding='utf-8'?>\n" + '<package xmlns="http://www.idpf.org/2007/opf" prefix="ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/ rendition: http://www.idpf.org/vocab/rendition/#" version="3.0" unique-identifier="pub-id" xml:lang="' + language + '">\n';
  let startMetadataTag = '  <metadata xmlns:opf="http://www.idpf.org/2007/opf" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:ibooks="http://apple.com/ibooks/html-extensions">\n\n';
  let endPackageTag ="</package>";

  let metaDataContents =
    '   <dc:language id="pub-langage">' + language + "</dc:language>\n" +
    '   <dc:identifier id="pub-id">urn:' + pubISBN + "</dc:identifier>\n" +
    '   <dc:source id="src-id">urn:' + originalISBN + "</dc:source>\n" +
    "\n" +
    '   <dc:title id="titre">'+ bookTitle + '</dc:title>\n' + //Here, id-tags are used: look into, whether or not we should replace them dynamically
    '   <meta refines="#titre" property="title-type">main</meta>\n' +
    "\n" +
    '   <dc:creator id="auteur1">' + author1 + '</dc:creator>\n' +
    '   <meta property="role" refines="#auteur1" scheme="marc:relators">aut</meta>\n' +
    '   <meta property="file-as" refines="#auteur1">' + author1 + '</meta>\n' +
    "\n" +
    '   <meta property="rendition:flow">scrolled-doc</meta>\n' +
    '   <meta property="rendition:layout">reflowable</meta>\n' +
    '   <meta property="rendition:orientation">portrait</meta>\n' +
    '   <meta property="rendition:spread">none</meta>\n' +
    "\n" +
    "\n" +
    "   <dc:publisher>" + publisher + "</dc:publisher>\n" +
    "   <dc:rights>Copyright ©" + copyright +"</dc:rights>\n" +
    "\n" +
    "   <dc:date>" + date.split("T")[0] + "</dc:date>\n" +
    '   <meta property="dcterms:modified">'+ date +'</meta>\n' +
    '   <dc:description id="description">' + description + '</dc:description>\n' +
    '   <dc:contributor id="'+contributor1ID + '">' + contributorLastname1 + ", " + contributorFirstname1 + '</dc:contributor>\n' +
    '   <meta scheme="marc:relators" property="role" refines="#="'+ contributor1ID + '">mrk</meta>\n' +
    '   <meta scheme="marc:relators" property="role" refines="#="'+ contributor1ID + '">prg</meta>\n' +
    '   <meta refines="#="'+contributor1ID + '" property="file-as">' + contributorFirstname1  + ", " + contributorLastname1 + '</meta>\n' +
    "\n" +  
    '   <meta name="cover" content="' + coverImage + '"/>\n' +
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
    '   <meta property="schema:accessibilitySummary">Les illustrations sont décrites.</meta>\n';// translate this
    
  let closeMetadata = "  </metadata>\n\n";
  let metaData = startMetadataTag + metaDataContents + closeMetadata;
    
  
  //here, stuff from the "files"-array will be written to the file
  let startManifestTag = "  <manifest>\n";
  let importedItems = "";
  let spineContents = ''

  files.forEach(filename => {
    let line = "";
    let name = filename.substring(filename.lastIndexOf('\\') + 1, filename.length);

    if(filename.includes("xhtml")){
      line = '   <item id="' + name + '" href="xhtml/' + name + '" media-type="application/xhtml+xml" properties="scripted svg" />';
      spineContents = spineContents + '   <itemref idref="'+ name +'"/>' + "\n";
    } else if(filename.includes("css")){
      line = '   <item id="' + name + '" href="css/' + name + '" media-type="text/css" />';
    }else if(filename.includes("js")){
      line = '   <item id="' + name + '" href="Misc/' + name + '" media-type="application/javascript" />';
    }else if(filename.includes("otf") || filename.includes(".ttf") ){
      line = '   <item id="' + name + '" href="' + name + '" media-type="application/vnd.ms-opentype" />';
    } else if(filename.includes(".mp3")){
      line = '   <item id="' + name + '" href="' + name + '" media-type="audio/mpeg" />';
    }

    importedItems = importedItems + line + "\n";
  });
  let endManifestTag = "  </manifest>\n\n";
  let manifest = startManifestTag + importedItems + endManifestTag;

  

  let startSpineTag = '  <spine toc="toc.ncx"></spine>\n';
  
  let endSpineTag = '  </spine>\n\n'
  let spine = startSpineTag + spineContents + endSpineTag;

  return header + metaData + manifest + spine + endPackageTag;
}

exports.containerFile = containerFileXML;
exports.createContentFile = createContentFile;
exports.createTOC = createTOC;
