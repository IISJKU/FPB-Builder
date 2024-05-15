const path = require("path");
const EPUBFileCreator = require("../epubFiles.js");
let fs = require("fs");

function makeFolder(location, name) {
  fs.mkdirSync(path.join(location, name));
}

function makeFile(location, name, content) {
  //if folder with that name exists, add (*) at the end.

  let dirName = location + name;
  let count = 1;

  if (fs.existsSync(location + name)) {
    while (fs.existsSync(location + name + "(" + count + ")")) {
      count = count + 1;
    }
    dirName = dirName + "(" + count + ")";
  }

  if (content == null || content == undefined || content == "undefined") {
    content = "";
  }

  fs.writeFileSync(dirName, content);
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
