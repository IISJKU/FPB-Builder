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

function setDirectory(d) {
  directory = d;
}
function getDirectory() {
  return directory;
}

//copy all of the files to the dedicated folders!
function importSelectedFiles(fileArray) {
  let rewritten = false;
  tempFile = "";

  directory.then((value) => {
    fileArray.forEach((element) => {
      rewritten = false;
      let subFolder = "";
      if (element.includes(".xhtml")) {
        rewriteDependencies(element);
        subFolder = "\\OEBPS\\xhtml\\";
        rewritten = true;
        //fs.copyFileSync(element, directory + "\\" + newDirName + "\\OEBPS\\xhtml" + PathUtilities.cutOutFilename(element));
      } else if (element.includes(".css")) {
        subFolder = "\\OEBPS\\css\\";
        importFonts(element, value["filePaths"][0]);
        rewritten = true;
      } else if (element.includes(".js")) {
        subFolder = "\\OEBPS\\Misc\\";
      } else if (element.includes(".mp3") || element.includes(".wav")) {
        subFolder = "\\OEBPS\\audio\\";
      }

      let i = element.lastIndexOf("\\");
      let relAdress = value["filePaths"][0] + "\\" + newDirName + subFolder;
      if (rewritten) {
        FileSystemManager.makeFile(relAdress, element.slice(i, element.length), tempFile);
      } else {
        relAdress = value["filePaths"][0] + "\\" + newDirName + subFolder + element.slice(i, element.length);
        fs.copyFileSync(element, relAdress);
        console.log(element);
      }

      relativePaths.push(relAdress);
      tempFile = "";
    });

    FileSystemManager.makeFile(value["filePaths"][0] + "/" + newDirName + "/OEBPS/", "content.opf", EPUBFileCreator.createContentFile(fileArray.concat(fonts)));
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
      let activeTag = line.includes(linkTag) ? linkTag : hrefTag;

      //<link rel="preload" href="../Misc/localforage.min.js" as="script" type="text/javascript" />;
      //cut stuff before href tag
      let firstPart = line.substring(0, line.indexOf(activeTag));
      //cut stuff after href
      let lastPart = line.substring(line.indexOf(activeTag), line.length);
      lastPart = line.substring(line.indexOf(activeTag), line.length);

      let start = null;
      let end = null;

      for (let i = 0; i < lastPart.length; i++) {
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

      let name = line.substring(firstPart.length, line.length - lastPart.length);
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

      tempFile = tempFile + firstPart + activeTag + '="' + newName + '"' + lastPart + "\n";
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
        //console.log();
        fs.copyFileSync(path, newPath + "\\" + newDirName + "\\OEBPS\\fonts\\" + path.substring(path.lastIndexOf("\\", path.length)));
        relativePaths.push(relPath);
      }
    }

    if (line.includes("}")) {
      open = false;
    }

    tempFile = tempFile + tLine + "\n";
  });
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
    FileSystemManager.makeFolder(tempDir, "Misc");
    FileSystemManager.makeFolder(tempDir, "xhtml");

    pickTempName();
  });
}

exports.importSelectedFiles = importSelectedFiles;
exports.createFileStructure = createFileStructure;
exports.setDirectory = setDirectory;
exports.getDirectory = getDirectory;
