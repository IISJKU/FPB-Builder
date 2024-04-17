const path = require("path");
const EPUBFileCreator = require("../epubFiles.js");
let fs = require("fs");

function makeFolder(location, name) {
  fs.mkdirSync(path.join(location, name));
}

function makeFile(location, name, content) {
  fs.writeFileSync(location + name, content);
}

function createFileStructure(name, path) {
  //create overall folder
  makeFolder(path, name);

  //Everything is put into this folder
  tempDir = path + "\\" + name + "\\";

  //create top layer in folder structure

  //the mimetype will be added when zipping!
  //FileSystemManager.makeFile(tempDir, "mimetype", "application/epub+zip");
  makeFolder(tempDir, "META-INF");
  makeFile(tempDir + "\\META-INF\\", "container.xml", EPUBFileCreator.containerFile);
  makeFile(tempDir + "\\META-INF\\", "com.apple.ibooks.display-options.xml", EPUBFileCreator.iBooksOptions);

  //Create OEBPS AND ALL THE FOLDERS and FILES INSIDE
  makeFolder(tempDir, "OEBPS");
  //set the tempDir one layer below
  tempDir = tempDir + "\\OEBPS\\";
  //create all of the folders inside this one
  makeFolder(tempDir, "audio");
  makeFolder(tempDir, "css");
  makeFolder(tempDir, "fonts");
  makeFolder(tempDir, "images");
  makeFolder(tempDir + "\\images\\", "notice");
  makeFolder(tempDir, "Misc");
  makeFolder(tempDir, "xhtml");
}

exports.createFileStructure = createFileStructure;
exports.makeFile = makeFile;
exports.makeFolder = makeFolder;
