const FileSystemManager = require("./fileSystemManager.js");
const EPUBFileCreator = require("./epubFiles.js"); //VS Code gives me a warning, but its fine haha
const PathUtilities = require("./pathUtilities.js");

let fs = require("fs");

let directory = null;
let newDirName = "TestEpub";
let relativePaths = [];

function setDirectory(d) {
  directory = d;
}
function getDirectory() {
  return directory;
}

//copy all of the files to the dedicated folders!
function importSelectedFiles(fileArray) {
  console.log("FileArray:");
  console.log(fileArray);
  directory.then((value) => {
    fileArray.forEach((element) => {
      let subFolder = "";
      if (element.includes(".xhtml")) {
        subFolder = "\\OEBPS\\xhtml\\";
        //fs.copyFileSync(element, directory + "\\" + newDirName + "\\OEBPS\\xhtml" + PathUtilities.cutOutFilename(element));
      } else if (element.includes(".css")) {
        subFolder = "\\OEBPS\\css\\";
      } else if (element.includes(".js")) {
        subFolder = "\\OEBPS\\Misc\\";
      }

      let i = element.lastIndexOf("\\");
      let relAdress = value["filePaths"][0] + "\\" + newDirName + subFolder + element.slice(i, element.length);
      fs.copyFileSync(element, relAdress);
      relativePaths.push(relAdress);
    });
  });
}

function createFileStructure() {
  directory.then((value) => {
    //create overall folder
    FileSystemManager.makeFolder(value["filePaths"][0], newDirName);

    //Everything is put into this folder
    tempDir = value["filePaths"][0] + "\\" + newDirName;

    //create top layer in folder structure
    FileSystemManager.makeFile(tempDir, "mimetype", "application/epub+zip");
    //TODO: Create META INF Folder, and put files in it
    FileSystemManager.makeFolder(tempDir, "META-INF");
    FileSystemManager.makeFile(tempDir + "\\META-INF", "container.xml", EPUBFileCreator.containerFile);

    //TODO
    //Create OEBPS AND ALL THE FOLDERS and FILES INSIDE
    FileSystemManager.makeFolder(tempDir, "OEBPS");
    //set the tempDir one layer below
    tempDir = tempDir + "\\OEBPS";
    //create all of the folders inside this one
    FileSystemManager.makeFolder(tempDir, "audio");
    FileSystemManager.makeFolder(tempDir, "css");
    FileSystemManager.makeFolder(tempDir, "fonts");
    FileSystemManager.makeFolder(tempDir, "images");
    FileSystemManager.makeFolder(tempDir, "Misc");
    FileSystemManager.makeFolder(tempDir, "xhtml");

    //TODO Write function that fills this file!
    //
    // This function is WIP!
    //
    //Create content.opf file
    FileSystemManager.makeFile(tempDir, "content.opf", EPUBFileCreator.createContentFile());
    //TODO Write function that fills this file!
    //
    // This function is WIP!
    //
    //create the TOC file
    FileSystemManager.makeFile(tempDir, "toc.ncx", EPUBFileCreator.createTOC());
  });
}

exports.importSelectedFiles = importSelectedFiles;
exports.createFileStructure = createFileStructure;
exports.setDirectory = setDirectory;
exports.getDirectory = getDirectory;
