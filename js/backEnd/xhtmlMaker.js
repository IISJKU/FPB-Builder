const FileSystemManager = require("./utilities/fileSystemUtility.js");
const EPUBFileCreator = require("./epubFiles.js");
let PathUtilities = require("./utilities/pathUtilities.js");
const pathU = require("path");
tempFile = "";

const relativePaths = new Array();
let fonts = new Array();

const fs = require("fs");

const { forEach, file } = require("jszip");

//this array contains every entry that is later going to be used in the "contents.opf" file
let contents = [];
let spine = [];

let metadata;
let language;
let pages = [];

let cover;
let credit;
let menuIllustration;

let options;
let fontNames;

let altText = new Map();

function setAltText(pages) {
  // WORK ON THIS!!!
  altText = new Map();
  pages.forEach((page) => {
    altText.set(page.imagesScripts.Image, page.alt[language]);
  });
}

function initialize(metad, pag, data) {
  spine = [];
  contents = [];
  pages = [];
  fonts = [];
  metadata = metad;
  pages = pag;
  options = data.options;
  fontNames = data.selectedFonts;

  if (typeof fontNames["Luciole"] != String) fontNames["Luciole"] = "\\imports\\fonts\\Luciole-Regular.ttf";

  //remove cover and credit from datastructure ;o
  cover = pages[pages.length - 3];
  credit = pages[pages.length - 2];
  menuIllustration = pages[pages.length - 1];

  pages.splice(pages.length - 3, 3);

  //this is some truely gangster stuff:
  //remove this as soon as there is an alternative lol
}

function setLanguage(lang) {
  language = lang;
  setAltText(pages);
}

/**
 * open the file, and replace old paths of css and js with the new paths!
 * @param {String} filePath
 */
function rewriteXHTMLFile(filePath) {
  tempFile = "";
  let loadedFile = fs.readFileSync(filePath, "utf8");

  fileSplit = loadedFile.split("\n");

  let linkTag = "href";
  let hrefTag = "src";

  let ariaSearchActive = false;

  let alt;

  fileSplit.forEach((line) => {
    let tempLine = line;

    let replacement = replaceOldFiles(tempLine);

    //replace old code with new files!
    if (replacement != "") {
      tempLine = replacement;
    } else if (line.includes("<link") || line.includes("<script") || line.includes("<source")) {
      let done = false;
      let index = 0;

      //this loop allows us to catch multiple tags in the same row! sometimes, there are multiple link tags in the same one
      while (!done) {
        let activeTag = tempLine.includes(linkTag, index) ? linkTag : hrefTag;

        //cut stuff before href tag
        let firstPart = tempLine.substring(0, tempLine.indexOf(activeTag, index));
        //cut stuff after href
        let lastPart = tempLine.substring(tempLine.indexOf(activeTag, index), tempLine.length);
        lastPart = tempLine.substring(tempLine.indexOf(activeTag, index), tempLine.length);

        let start = null;
        let end = null;

        for (let i = index; i < lastPart.length; i++) {
          if (lastPart[i] == "'" || lastPart[i] == '"') {
            if (start == null) {
              start = i;
            } else {
              end = i;
              break;
            }
          }
        }

        lastPart = lastPart.substring(end + 1, lastPart.length);

        let name = line.substring(firstPart.length, tempLine.length - lastPart.length);

        let newName = "";
        let open = false;

        for (let i = name.length - 1; i > 0; i--) {
          if (!open && (name[i] == "'" || name[i] == '"')) {
            open = true;
          } else if (open && (name[i] == "\\" || name[i] == "/")) {
            break;
          } else if (open) {
            newName = name[i] + newName;
          }
        }

        newName = newName.substring(0, newName.lastIndexOf(".")).replaceAll(" ", "_") + newName.substring(newName.lastIndexOf("."), newName.length); //make sure file names dont include spaces

        if (newName.includes(".css")) {
          newName = "../css/" + newName;
        } else if (newName.includes(".js")) {
          newName = "../Misc/" + newName;
        } else if (newName.includes(".mp3")) {
          newName = "../audio/" + newName;
        } else if (newName.includes(".wav")) {
          newName = "../audio/" + newName;
        }

        console.log(newName);

        if (firstPart.trim() != "") {
          tempLine = firstPart + activeTag + '="' + newName + '"' + lastPart;
        } else {
          tempLine = line;
        }

        index = tempLine.indexOf(activeTag, index) + 1;

        if (!tempLine.includes(linkTag, index) && !tempLine.includes(hrefTag, index)) {
          done = true;
        }
      }

      //i comented this out as an attempt at a bugfix, thats why im leaving it like this
      //dont know why this fixes it, but it does!
      //tempFile = tempFile + tempLine + "\n";
    } else if (line.includes("<svg")) {
      ariaSearchActive = true;
    }

    if (ariaSearchActive && line.includes("aria-label")) {
      ariaSearchActive = false;
      alt = altText.get(filePath);
      tempLine = line.substring(0, line.indexOf('"', line.indexOf("aria-label")) + 1) + alt + line.substring(line.lastIndexOf('"'), line.length);
    }

    tempFile = tempFile + tempLine + "\n";
  });

  const imgAltText = {
    EN: {
      colAria: "Color Button",
      bttnPlay: "Play animation",
      descrBttns: "Choose how complex the image is",
      bttnAlt1: "Complexity 1",
      bttnAlt2: "Complexity 2",
      bttnAlt3: "Complexity 3",
      bttnAlt4: "Complexity 4",
      bttnAlt5: "Complexity 5",
    },
    FR: {
      colAria: "Bouton de couleur",
      bttnPlay: "Lire l’animation",
      descrBttns: "Choisissez la complexité de l’image",
      bttnAlt1: "Complexité 1",
      bttnAlt2: "Complexité 2",
      bttnAlt3: "Complexité 3",
      bttnAlt4: "Complexité 4",
      bttnAlt5: "Complexité 5",
    },
    DE: {
      colAria: "Farbtaste",
      bttnPlay: "Animation abspielen",
      descrBttns: "Wähle die Bildkomplexität",
      bttnAlt1: "Komplexität 1",
      bttnAlt2: "Komplexität 2",
      bttnAlt3: "Komplexität 3",
      bttnAlt4: "Komplexität 4",
      bttnAlt5: "Komplexität 5",
    },
    LIT: {
      colAria: "Spalvos mygtukas",
      bttnPlay: "Paleisti animaciją",
      descrBttns: "Pasirinkite paveikslėlio sudėtingumą",
      bttnAlt1: "Sudėtingumas 1",
      bttnAlt2: "Sudėtingumas 2",
      bttnAlt3: "Sudėtingumas 3",
      bttnAlt4: "Sudėtingumas 4",
      bttnAlt5: "Sudėtingumas 5",
    },
    IT: {
      colAria: "Pulsante colore",
      bttnPlay: "Avvia animazione",
      descrBttns: "Scegli la complessità dell'immagine",
      bttnAlt1: "Complessità 1",
      bttnAlt2: "Complessità 2",
      bttnAlt3: "Complessità 3",
      bttnAlt4: "Complessità 4",
      bttnAlt5: "Complessità 5",
    },
  };

  tempFile = tempFile.replaceAll("{altTextImage}", alt);
  tempFile = tempFile.replaceAll("{colAria}", imgAltText[language]["colAria"]);
  tempFile = tempFile.replaceAll("{bttnPlay}", imgAltText[language]["bttnPlay"]);
  tempFile = tempFile.replaceAll("{descrBttns}", imgAltText[language]["descrBttns"]);

  for (var i = 0; i < 5; i++) {
    tempFile = tempFile.replaceAll("{bttnAlt" + (i + 1) + "}", imgAltText[language]["bttnAlt" + (i + 1)]);
  }
}

function replaceOldFiles(s) {
  if (s.includes('src="../Misc/ldqr.min.js"')) {
    return '    <script type="text/javascript" src="../Misc/ldqr2.js" charset="utf-8"></script>';
  } else if (s.includes('href="../Misc/ldqr.min.js"')) {
    return '    <link rel="preload" href="../Misc/ldqr2.js" as="script" type="text/javascript" />';
  }

  return "";
}

function addAltText(elem) {}

/**
 *  takes the array containing absolute paths (of files regardless of type) and text  as input and creates xhtml out of it
 * @param {Array} fileArray The array of files, that can also contain text
 * @param {Promise} directory The directory the files will be copied to!
 * @param {String} newDirName The name of the dir, where everything will be copied into
 */
function createXHTMLFiles(fileArray, path, newDirName) {
  let rewritten = false;
  tempFile = "";
  EPUBFileCreator.setLanguage(language);
  EPUBFileCreator.setMetadata(metadata);
  EPUBFileCreator.setOptions(options);

  //import the images needed for the settings / notice
  fileArray = fileArray.concat(pathsToImages(language));

  //import js and css needed for the menu, replace files with new ones provided by us

  fileArray = addDependencies(fileArray);
  console.log(fileArray);

  let coverImage = cover.imagesScripts.Image[language];
  EPUBFileCreator.setCover(coverImage);
  let coverNarration = cover.narration[language];

  spine = [];
  contents = [];
  fonts = [];

  //make the cover
  FileSystemManager.makeFile(
    path + "\\" + newDirName + "\\OEBPS\\xhtml\\",
    "cover.xhtml",
    EPUBFileCreator.createCover(metadata.title[language], coverImage, cover.alt[language], coverNarration)
  );
  spine.push("cover.xhtml");

  fonts = fonts.concat(pathsToFonts());

  console.log("!!!!!!!!!!!!!!!!!!!!!!");
  console.log(cover.alt);
  console.log(pages);

  fonts.forEach((p) => {
    let symb = "\\";
    if (!p.includes(symb)) symb = "/";

    let fPath = __dirname + p;
    if (p.includes(":\\")) fPath = p;
    let newPath = pathU.normalize(
      path + pathU.sep + newDirName + pathU.sep + "OEBPS" + pathU.sep + "fonts" + pathU.sep + p.substring(p.lastIndexOf(symb, p.length)).replaceAll(" ", "_")
    );
    fPath = pathU.normalize(fPath);

    if (fPath.includes("/")) {
      fPath = fPath.replaceAll("\\", "/");
      fPath = fPath.replaceAll("//", "/");
    }

    fs.copyFileSync(fPath, newPath);
  });

  if (options.includeBookSettings) {
    //make page 00
    FileSystemManager.makeFile(
      path + "\\" + newDirName + "\\OEBPS\\xhtml\\",
      "page00.xhtml",
      EPUBFileCreator.createPage00(menuIllustration, pages[0].narration[language], fontNames, options.numberOfLayers)
    );
    spine.push("page00.xhtml");
  }

  fileArray.push(coverImage);
  fileArray.push(coverNarration);

  //fileArray = removeOldFiles(fileArray);

  let testStr = "";
  fileArray.forEach((element) => {
    if (element != undefined) testStr = testStr + element.toString() + "\n";
  });

  //fs.writeFileSync(path + "\\" + newDirName + "\\OEBPS\\files.txt", testStr);

  fileArray.forEach((element) => {
    tempFile = "";
    rewritten = false;
    let subFolder = "";
    //handle txt.xhtml files
    if (typeof element != "string") {
      //
      // Import Text file here!
      //
      if (element != undefined) {
        FileSystemManager.makeFile(path + "/" + newDirName + "/OEBPS/xhtml/", element.title + "-txt.xhtml", EPUBFileCreator.createPageText(element));
        spine.push("..\\OEBPS\\xhtml\\" + element.title + "-txt.xhtml");
      }
    } else {
      //element = element.replaceAll("/", "\\");

      //look at where the name should be cut!
      let i = element.lastIndexOf("\\");
      if (element.includes("/")) {
        i = element.lastIndexOf("/");
      }

      //handle files where path was given!
      if (element.toLowerCase().includes(".xhtml")) {
        rewriteXHTMLFile(element);

        subFolder = "\\OEBPS\\xhtml\\";
        rewritten = true;
        spine.push(element.slice(i, element.length));
        //fs.copyFileSync(element, directory + "\\" + newDirName + "\\OEBPS\\xhtml" + PathUtilities.cutOutFilename(element));
      } else if (element.toLowerCase().includes(".css")) {
        if (!element.toLowerCase().includes("ldqr_main")) {
          subFolder = "\\OEBPS\\css\\";
          importFonts(element, path, newDirName);
          rewritten = true;
          contents.push("..\\OEBPS\\xhtml\\" + element);
        } else {
          subFolder = "\\OEBPS\\css\\";
          addFonts(element);
          contents.push("..\\OEBPS\\xhtml\\" + element);
          rewritten = true;
        }
      } else if (element.toLowerCase().includes(".js")) {
        subFolder = "\\OEBPS\\Misc\\";
        if (element.includes("ldqr2")) {
          rewriteFontSection(element);
          rewritten = true;
        }
        contents.push(element);
      } else if (element.toLowerCase().includes(".mp3") || element.toLowerCase().includes(".wav")) {
        subFolder = "\\OEBPS\\audio\\";
        contents.push(element);
      } else if (
        element.toLowerCase().includes(".jpg") ||
        element.toLowerCase().includes(".jpeg") ||
        element.toLowerCase().includes(".svg") ||
        element.toLowerCase().includes(".svg") ||
        element.toLowerCase().includes(".png") ||
        element.toLowerCase().includes(".gif")
      ) {
        subFolder = "\\OEBPS\\images\\";
        if (element.includes("\\notice\\") || element.includes("/notice/")) {
          subFolder = "\\OEBPS\\images\\notice\\";

          i = element.lastIndexOf("\\");
          if (element.includes("/notice/")) i = element.lastIndexOf("/");
        }
        contents.push(element);
      }

      let relAdress = path + "\\" + newDirName + subFolder;

      if (rewritten) {
        FileSystemManager.makeFile(relAdress, element.slice(i, element.length), tempFile);
      } else {
        relAdress = path + "\\" + newDirName + subFolder + element.slice(i, element.length).replaceAll(" ", "_");

        if (!(element == "" || relAdress == "")) {
          if (element.includes("/")) element = element.replaceAll("\\", "/");
          if (relAdress.includes("/")) relAdress = relAdress.replaceAll("\\", "/");

          fs.copyFileSync(pathU.normalize(element), pathU.normalize(relAdress));
        }
      }

      relativePaths.push(relAdress);
    }
  });
  tempFile = "";

  if (options.includeInstructions) {
    //make the notice_toc file
    FileSystemManager.makeFile(path + "/" + newDirName + "/OEBPS/xhtml/", "notice_toc.xhtml", EPUBFileCreator.createNoticeToc());
    spine.push("notice_toc.xhtml");

    //make the notice file
    FileSystemManager.makeFile(path + "/" + newDirName + "/OEBPS/xhtml/", "notice.xhtml", EPUBFileCreator.createNotice());
    spine.push("notice.xhtml");
  }

  //make the credits
  FileSystemManager.makeFile(path + "/" + newDirName + "/OEBPS/xhtml/", "credits.xhtml", EPUBFileCreator.createCredits(credit));
  spine.push("credits.xhtml");

  //FileSystemManager.makeFile(value["filePaths"][0] + "/" + newDirName + "/OEBPS/xhtml/", "testTxt.xhtml", EPUBFileCreator.createPageText(txt));
  FileSystemManager.makeFile(path + "/" + newDirName + "/OEBPS/xhtml/", "toc.xhtml", EPUBFileCreator.createTocXHTML(pages));
  spine.push("toc.xhtml");

  FileSystemManager.makeFile(path + "/" + newDirName + "/OEBPS/", "content.opf", EPUBFileCreator.createContentFile(contents.concat(fonts), spine));

  FileSystemManager.makeFile(path + "/" + newDirName + "/OEBPS/", "toc.ncx", EPUBFileCreator.createTOC());
}

/**
 *  Adds dependencies that are needed.
 * Replaces old files with new ones, provided by us.
 *
 *  @param Arr
 *  @returns Array
 */
function addDependencies(arr) {
  let menuDep = pathsToMenuDependencies();
  let nuArr = [];

  //if a simmilar dependency gets imported, remove it

  arr.forEach((el) => {
    if (typeof el != "string") nuArr.push(el);
    else {
      let sep = "/";
      if (el.includes("\\")) sep = "\\";

      let found = false;

      menuDep.forEach((mEl) => {
        //console.log(mEl.substring(mEl.lastIndexOf(pathU.sep) + 1, mEl.length));
        if (mEl.substring(mEl.lastIndexOf(pathU.sep) + 1, mEl.length) == el.substring(el.lastIndexOf(sep) + 1, el.length)) {
          /*
          console.log("------------------------------------------");
          console.log(el.substring(el.lastIndexOf(sep) + 1, el.length));
          console.log("------------------------------------------");
          */

          found = true;
        }
      });

      if (!found) nuArr.push(el);
    }
  });

  nuArr = nuArr.concat(menuDep);

  return nuArr;
}

function removeOldFiles(arr) {
  let removedLDQR_MAIN_CSS = false;
  let t = [];
  arr.forEach((entr) => {
    if (typeof entr == "string") {
      if (!removedLDQR_MAIN_CSS && entr.includes("ldqr_main")) {
        removedLDQR_MAIN_CSS = true;
      } else {
        t.push(entr);
      }
    } else {
      t.push(entr);
    }
  });

  return t;
}

function rewriteFontSection(element) {
  tempFile = "";
  let file = fs.readFileSync(element, "utf8");
  let fileSplit = file.split("\n");
  let t = "";
  let open = true;
  let tempOpen = true;
  let inFunction = false;

  fileSplit.forEach((line) => {
    tempOpen = true;
    if (line.includes("ldqr.FONT_CSS_CLASS = [")) {
      let t = "";
      for (const [key, value] of Object.entries(fontNames)) {
        t = t + '"ldqr-font-' + key.replaceAll(" ", "").toLowerCase() + '",';
      }
      t = t.substring(0, t.length - 1);
      let tLine = line.substring(0, line.indexOf("[") + 1) + t + line.substring(line.indexOf("]"), line.length) + "\n";
      tempFile = tempFile + tLine;

      tempOpen = false;
    }

    if (line.includes("function choixFontName(d)")) {
      inFunction = true;
    }

    if (open && tempOpen) {
      tempFile = tempFile + line + "\n";
    }
    if (inFunction) {
      if (line.includes("switch")) {
        open = false;
      }
      if (line.includes("default:")) {
        open = true;
        for (const [key, value] of Object.entries(fontNames)) {
          line =
            '      case "' +
            key.replaceAll(" ", "") +
            '":\n' +
            '        className = "ldqr-font-' +
            key.replaceAll(" ", "").toLowerCase() +
            '";\n' +
            "        break; \n" +
            line;
        }
        tempFile = tempFile + line + "\n";
        inFunction = false;
      }
    }
  });
}

function addFonts(element) {
  let file = fs.readFileSync(element, "utf8");
  let fileSplit = file.split("\n");
  let open = false;
  fileSplit.forEach((line) => {
    let tLine = "";
    if (line.includes("/* FONTS HERE */")) {
      for (const [key, value] of Object.entries(fontNames)) {
        let link = value.substring(value.lastIndexOf("/") + 1, value.length);
        if (value.includes("\\")) {
          link = value.substring(value.lastIndexOf("\\") + 1, value.length);
        }

        tLine =
          tLine +
          "@font-face {\n" +
          '  font-family: "' +
          key +
          '";\n' +
          "  font-weight: normal;\n" +
          "  font-style: normal;\n" +
          "  font-variant-numeric: normal;\n" +
          '  src: url("../fonts/' +
          link.replaceAll(" ", "_") +
          '") format("truetype");\n' +
          "}\n";
      }
    } else if (line.includes('font-family: "";')) {
      tLine = line.substring(0, line.indexOf('"') + 1) + Object.keys(fontNames)[0] + '";';
    } else if (line.includes("/* FONTIDS */")) {
      for (const [key, value] of Object.entries(fontNames)) {
        tLine = tLine + ".ldqr-font-" + key.replaceAll(" ", "").toLowerCase() + "{\n" + '  font-family: "' + key + '", "sans-serif" !important;\n' + " }\n";
      }
    } else {
      tLine = line;
    }
    tempFile = tempFile + tLine + "\n";
  });
  tempfile = "";
}

//goes through css files line by line, looks for a font-face tag, ads fonts to array & changes location in file
function importFonts(element, newPath, newDirName) {
  let file = fs.readFileSync(element, "utf8");
  let fileSplit = file.split("\n");
  tempfile = "";

  let open = false;

  fileSplit.forEach((line) => {
    let tLine = line;
    if (line.includes("font-face")) {
      open = true;
    }
    if (open && line.includes("src")) {
      //inside font-face tag means it has to be a link to a font!
      let path = PathUtilities.cutOutFilename(line, "url");
      path = PathUtilities.getAbsolutePath(element, path);

      //paste this into the css file;
      let symb = "\\";
      if (!path.includes(symb)) symb = "/";

      let relPath = "../fonts/" + path.substring(path.lastIndexOf(symb) + 1, path.length).replaceAll(" ", "_");
      let firstBracketIndex = line.indexOf("(");
      let secondBracket = line.indexOf(")");
      //+ line.substring(secondBracket, line.length)
      tLine = line.substring(0, firstBracketIndex + 1) + '"' + relPath + '"' + line.substring(secondBracket, line.length);

      if (newFont(path)) {
        fonts.push(path);
        fs.copyFileSync(path, newPath + "\\" + newDirName + "\\OEBPS\\fonts\\" + path.substring(path.lastIndexOf("\\", path.length)));
      }

      if (!relativePaths.includes(relPath)) relativePaths.push(relPath);
    }

    if (line.includes("}")) {
      open = false;
    }

    tempFile = tempFile + tLine + "\n";
  });

  //contents.concat(fonts);
}

function newFont(name) {
  let newF = true;

  fonts.forEach((font) => {
    //check if relative or absolute path
    let = fontSymb = "\\";
    if (!font.includes("\\")) fontSymb = "/";

    let = nSymb = "\\";
    if (!name.includes("\\")) nSymb = "/";

    if (font == name || font.substring(font.lastIndexOf(fontSymb) + 1, font.length) == name.substring(name.lastIndexOf(nSymb) + 1, name.length)) {
      newF = false;
    }
  });

  return newF;
}

function pathsToFonts() {
  let f = [];
  for (const [key, value] of Object.entries(fontNames)) {
    f.push(value);
  }

  return f;
}

function pathsToMenuDependencies() {
  let arr = new Array(
    __dirname + pathU.sep + "imports" + pathU.sep + "colorisation.min.js",
    __dirname + pathU.sep + "imports" + pathU.sep + "ldqr_main.min.css",
    __dirname + pathU.sep + "imports" + pathU.sep + "colorisation.css",
    __dirname + pathU.sep + "imports" + pathU.sep + "page00_svg.css",
    __dirname + pathU.sep + "imports" + pathU.sep + "page00.min.js",
    __dirname + pathU.sep + "imports" + pathU.sep + "radiobutton.js",
    __dirname + pathU.sep + "imports" + pathU.sep + "radiogroup.js",
    __dirname + pathU.sep + "imports" + pathU.sep + "ldqr2.js",
    __dirname + pathU.sep + "imports" + pathU.sep + "localforage.min.js",
    __dirname + pathU.sep + "imports" + pathU.sep + "SVGPanZoom.min.js"
  );

  return arr;
}

function pathsToImages(language) {
  let a = new Array(
    "afnic.jpg",
    "aveugles.png",
    "edu-up.jpg",
    "Ftelecom.png",
    "RBFC.jpg",
    "version01-coul.png",
    "version01-nb.png",
    "version02-coul.png",
    "version02-nb.png",
    "version03-coul.png",
    "version03-nb.png",
    "version04-coul.png",
    "version04-nb.png",
    "version05-coul.png",
    "version05-nb.png",
    "notice" + pathU.sep + "image020.jpg",
    "notice" + pathU.sep + "image022.jpg",
    "notice" + pathU.sep + "image024.jpg",
    "notice" + pathU.sep + "image026.jpg",
    "notice" + pathU.sep + "image028.jpg",
    "notice" + pathU.sep + "image030.jpg",
    "notice" + pathU.sep + "image032.jpg",
    "notice" + pathU.sep + "image034.png",
    "notice" + pathU.sep + "image038.png",
    "notice" + pathU.sep + "image039.png",
    "notice" + pathU.sep + "image042.jpg",
    "notice" + pathU.sep + "image043.jpg",
    "notice" + pathU.sep + "image044.jpg",
    "notice" + pathU.sep + "image045.jpg",
    "notice" + pathU.sep + "image046.jpg",
    "notice" + pathU.sep + "image047.jpg",
    "notice" + pathU.sep + "image050.jpg",
    "notice" + pathU.sep + "image055.jpg",
    "notice" + pathU.sep + "image058.jpg",
    "notice" + pathU.sep + "image060.jpg",
    "notice" + pathU.sep + "image062.jpg",
    "notice" + pathU.sep + "image063.jpg",
    "notice" + pathU.sep + "image064.jpg",
    "notice" + pathU.sep + "image065.jpg",
    "notice" + pathU.sep + "image068.jpg",
    "notice" + pathU.sep + "image070.jpg",
    "notice" + pathU.sep + "image072.png",
    "notice" + pathU.sep + "image073.jpg",
    "notice" + pathU.sep + "home.svg",
    "notice" + pathU.sep + "logo_erasmusplus.svg"
  );

  for (let i = 0; i < a.length; i++) {
    a[i] = __dirname + pathU.sep + "templates" + pathU.sep + language.toLowerCase() + pathU.sep + "images" + pathU.sep + a[i];
  }
  return a;
}

module.exports.initialize = initialize;
module.exports.setLanguage = setLanguage;
module.exports.createXHTMLFiles = createXHTMLFiles;
