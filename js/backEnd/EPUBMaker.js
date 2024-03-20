const FileSystemManager = require("./fileSystemManager.js");
const EPUBFileCreator = require("./epubFiles.js"); //VS Code gives me a warning, but its fine haha
const PathUtilities = require("./pathUtilities.js");

let fs = require("fs");
const { dir } = require("console");

//set this to null to let the user pick for themselves
//let directory = null;
let directory = new Promise((value) => {
  const path = {
    canceled: false,
    filePaths: ["C:\\Users\\ak127746\\Desktop\\Testing Folder"],
  };
  value(path);
});
let newDirName = "TestEpub_";
let relativePaths = [];
let tempFile = "";
let fonts = [];

//elements belonging in the spine shall be here
let spine = [];
//everything that will be imported from
let contents = [];

function setDirectory(d) {
  directory = d;
}
function getDirectory() {
  return directory;
}

//makes cover and page00
function makeCover(title, cover, altText, audio) {
  directory.then((value) => {
    FileSystemManager.makeFile(
      value["filePaths"][0] + "/" + newDirName + "/OEBPS/xhtml/",
      "cover.xhtml",
      EPUBFileCreator.createCover(title, cover, altText, audio)
    );
    FileSystemManager.makeFile(value["filePaths"][0] + "/" + newDirName + "/OEBPS/xhtml/", "page00.xhtml", EPUBFileCreator.createPage00());
  });

  spine.push("cover.xhtml");
  spine.push("page00.xhtml");
}

//copy all of the files to the dedicated folders!
function importSelectedFiles(fileArray) {
  let rewritten = false;
  tempFile = "";

  //import the images needed for the settings / notice
  fileArray = fileArray.concat(pathsToNoticeImages());

  //import js and css needed for the menu
  fileArray = fileArray.concat(pathsToMenuDependencies());

  directory.then((value) => {
    fileArray.forEach((element) => {
      rewritten = false;
      let subFolder = "";
      //handle txt.xhtml files
      if (typeof element != "string") {
        //
        // Import Text file here!
        //
        FileSystemManager.makeFile(
          value["filePaths"][0] + "/" + newDirName + "/OEBPS/xhtml/",
          element.title + "-txt.xhtml",
          EPUBFileCreator.createPageText(element)
        );

        spine.push("..\\OEBPS\\xhtml\\" + element.title + "-txt.xhtml");
      } else {
        //look at where the name should be cut!
        let i = element.lastIndexOf("\\");
        if (element.includes("/")) {
          i = element.lastIndexOf("/");
        }

        //handle files where path was given!
        if (element.includes(".xhtml")) {
          rewriteDependencies(element);
          subFolder = "\\OEBPS\\xhtml\\";
          rewritten = true;
          spine.push(element.slice(i, element.length));
          //fs.copyFileSync(element, directory + "\\" + newDirName + "\\OEBPS\\xhtml" + PathUtilities.cutOutFilename(element));
        } else if (element.includes(".css")) {
          subFolder = "\\OEBPS\\css\\";
          importFonts(element, value["filePaths"][0]);
          rewritten = true;
          contents.push("..\\OEBPS\\xhtml\\" + element);
        } else if (element.includes(".js")) {
          subFolder = "\\OEBPS\\Misc\\";
          contents.push(element);
        } else if (element.includes(".mp3") || element.includes(".wav")) {
          subFolder = "\\OEBPS\\audio\\";
          contents.push(element);
        } else if (element.includes(".jpg") || element.includes(".svg") || element.includes(".svg") || element.includes(".png")) {
          subFolder = "\\OEBPS\\images\\";
          if (element.includes("/notice/")) {
            subFolder = "\\OEBPS\\images\\notice\\";
            i = element.lastIndexOf("/");
          }
          contents.push(element);
        }

        let relAdress = value["filePaths"][0] + "\\" + newDirName + subFolder;

        if (rewritten) {
          FileSystemManager.makeFile(relAdress, element.slice(i, element.length), tempFile);
        } else {
          relAdress = value["filePaths"][0] + "\\" + newDirName + subFolder + element.slice(i, element.length);
          fs.copyFileSync(element, relAdress);
        }

        relativePaths.push(relAdress);
      }

      tempFile = "";
    });

    //testing this out, this will later be moved somewhere else!
    const txt = {
      pageName: "Page 5",
      title: "Seite05 - TEXT",
      lang: "de",
      id: "pg05",
      ariaLabel: "page 5",
      text: "Was? Eine Fledermaus?",
      audio: "../audio/page05.mp3",
    };

    //make the notice_toc file
    FileSystemManager.makeFile(value["filePaths"][0] + "/" + newDirName + "/OEBPS/xhtml/", "notice_toc.xhtml", EPUBFileCreator.createNoticeToc());
    spine.push("notice_toc.xhtml");

    //make the notice file
    FileSystemManager.makeFile(value["filePaths"][0] + "/" + newDirName + "/OEBPS/xhtml/", "notice.xhtml", EPUBFileCreator.createNotice());
    spine.push("notice.xhtml");

    //make the credits
    FileSystemManager.makeFile(value["filePaths"][0] + "/" + newDirName + "/OEBPS/xhtml/", "credits.xhtml", EPUBFileCreator.createCredits());
    spine.push("credits.xhtml");

    //FileSystemManager.makeFile(value["filePaths"][0] + "/" + newDirName + "/OEBPS/xhtml/", "testTxt.xhtml", EPUBFileCreator.createPageText(txt));

    FileSystemManager.makeFile(
      value["filePaths"][0] + "/" + newDirName + "/OEBPS/",
      "content.opf",
      EPUBFileCreator.createContentFile(contents.concat(fonts), spine)
    );

    FileSystemManager.makeFile(value["filePaths"][0] + "/" + newDirName + "/OEBPS/", "toc.ncx", EPUBFileCreator.createTOC());
  });
}

//open the file, and replace old paths of css and js with the new paths!
function rewriteDependencies(filePath) {
  tempFile = "";
  let loadedFile = fs.readFileSync(filePath, "utf8");

  fileSplit = loadedFile.split("\n");

  let linkTag = "href";
  let hrefTag = "src";

  fileSplit.forEach((line) => {
    if (line.includes("<link") || line.includes("<script") || line.includes("<source")) {
      let done = false;
      let index = 0;
      let tempLine = line;

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
        if (newName.includes(".css")) {
          newName = "../css/" + newName;
        } else if (newName.includes(".js")) {
          newName = "../Misc/" + newName;
        } else if (newName.includes(".mp3")) {
          newName = "../audio/" + newName;
        }

        tempLine = firstPart + activeTag + '="' + newName + '"' + lastPart;

        index = tempLine.indexOf(activeTag, index) + 1;

        if (!tempLine.includes(linkTag, index) && !tempLine.includes(hrefTag, index)) {
          done = true;
        }
      }

      tempFile = tempFile + tempLine + "\n";
    } else {
      tempFile = tempFile + line + "\n";
    }
  });
}

//this picks the name of the epub, according to how many files are in the folder,
//this is just for testing!
function pickTempName() {
  directory.then((value) => {
    names = fs.readdirSync(value["filePaths"][0]);
    newDirName = newDirName + names.length;
  });
}

function pathsToNoticeImages() {
  return new Array(
    "./js/backEnd/images/notice/image020.jpg",
    "./js/backEnd/images/notice/image022.jpg",
    "./js/backEnd/images/notice/image024.jpg",
    "./js/backEnd/images/notice/image026.jpg",
    "./js/backEnd/images/notice/image028.jpg",
    "./js/backEnd/images/notice/image030.jpg",
    "./js/backEnd/images/notice/image032.jpg",
    "./js/backEnd/images/notice/image034.png",
    "./js/backEnd/images/notice/image038.png",
    "./js/backEnd/images/notice/image039.png",
    "./js/backEnd/images/notice/image042.jpg",
    "./js/backEnd/images/notice/image043.jpg",
    "./js/backEnd/images/notice/image044.jpg",
    "./js/backEnd/images/notice/image046.jpg",
    "./js/backEnd/images/notice/image047.jpg",
    "./js/backEnd/images/notice/image050.jpg",
    "./js/backEnd/images/notice/image055.jpg",
    "./js/backEnd/images/notice/image058.jpg",
    "./js/backEnd/images/notice/image060.jpg",
    "./js/backEnd/images/notice/image062.jpg",
    "./js/backEnd/images/notice/image063.jpg",
    "./js/backEnd/images/notice/image064.jpg",
    "./js/backEnd/images/notice/image065.jpg",
    "./js/backEnd/images/notice/image068.jpg",
    "./js/backEnd/images/notice/image070.jpg",
    "./js/backEnd/images/notice/image072.png",
    "./js/backEnd/images/notice/image073.jpg",
    "./js/backEnd/images/notice/home.svg",
    "./js/backEnd/images/notice/logo_erasmusplus.svg"
  );
}

function pathsToMenuDependencies() {
  return new Array("./js/backEnd/imports/colorisation.min.js", "./js/backEnd/imports/colorisation.css");
}

//goes through css files line by line, looks for a font-face tag, ads fonts to array & changes location in file
function importFonts(element, newPath) {
  let file = fs.readFileSync(element, "utf8");
  let fileSplit = file.split("\n");

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

      if (!fonts.includes(path)) {
        fonts.push(path);

        //paste this into the css file;
        relPath = "../fonts/" + path.substring(path.lastIndexOf("\\") + 1, path.length);
        let firstBracketIndex = line.indexOf("(");
        let secondBracket = line.indexOf(")");
        //+ line.substring(secondBracket, line.length)
        tLine = line.substring(0, firstBracketIndex + 1) + '"' + relPath + '"' + line.substring(secondBracket, line.length);
        fs.copyFileSync(path, newPath + "\\" + newDirName + "\\OEBPS\\fonts\\" + path.substring(path.lastIndexOf("\\", path.length)));
        relativePaths.push(relPath);
      }
    }

    if (line.includes("}")) {
      open = false;
    }

    tempFile = tempFile + tLine + "\n";
  });

  contents.concat(fonts);
}

function createFileStructure() {
  pickTempName();
  directory.then((value) => {
    //create overall folder
    FileSystemManager.makeFolder(value["filePaths"][0], newDirName);

    //Everything is put into this folder
    tempDir = value["filePaths"][0] + "\\" + newDirName + "\\";

    //create top layer in folder structure
    FileSystemManager.makeFile(tempDir, "mimetype", "application/epub+zip");
    //TODO: Create META INF Folder, and put files in it
    FileSystemManager.makeFolder(tempDir, "META-INF");
    FileSystemManager.makeFile(tempDir + "\\META-INF\\", "container.xml", EPUBFileCreator.containerFile);
    FileSystemManager.makeFile(tempDir + "\\META-INF\\", "com.apple.ibooks.display-options.xml", EPUBFileCreator.iBooksOptions);

    //TODO
    //Create OEBPS AND ALL THE FOLDERS and FILES INSIDE
    FileSystemManager.makeFolder(tempDir, "OEBPS");
    //set the tempDir one layer below
    tempDir = tempDir + "\\OEBPS\\";
    //create all of the folders inside this one
    FileSystemManager.makeFolder(tempDir, "audio");
    FileSystemManager.makeFolder(tempDir, "css");
    FileSystemManager.makeFolder(tempDir, "fonts");
    FileSystemManager.makeFolder(tempDir, "images");
    FileSystemManager.makeFolder(tempDir + "\\images\\", "notice");
    FileSystemManager.makeFolder(tempDir, "Misc");
    FileSystemManager.makeFolder(tempDir, "xhtml");

    pickTempName();
  });
}

exports.makeCover = makeCover;
exports.importSelectedFiles = importSelectedFiles;
exports.createFileStructure = createFileStructure;
exports.setDirectory = setDirectory;
exports.getDirectory = getDirectory;
