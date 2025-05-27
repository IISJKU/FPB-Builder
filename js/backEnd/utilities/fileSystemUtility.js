const path = require("path");
const EPUBFileCreator = require("../epubFiles.js");
let fs = require("fs");

function makeFolder(location, name) {
  fs.mkdirSync(path.normalize(path.join(location, name)));
}

function makeFile(location, name, content) {
  //if folder with that name exists, add (*) at the end.

  if (name.includes(" ")) {
    console.log("Path Rewritten");
    console.log(name);
    name = name.replaceAll(" ", "_");
    console.log(name);
  }
  let dirName = location + name;
  let count = 1;

  if (fs.existsSync(path.normalize(location + name))) {
    while (fs.existsSync(path.normalize(location + name + "(" + count + ")"))) {
      count = count + 1;
    }

    if (dirName.includes(".")) {
      dirName = dirName.substring(0, dirName.indexOf(".")) + "(" + count + ")" + dirName.substring(dirName.indexOf("."), dirName.length);
    } else {
      dirName = dirName + "(" + count + ")";
    }
  }

  if (content == null || content == undefined || content == "undefined") {
    content = "";
  }

  ////////////////////////
  //
  // TODO after break: rewrite this to fix names with spaces with __
  //
  ////////////////////////

  if (dirName.includes("/")) dirName = dirName.replaceAll("\\", "/");

  let t = path.normalize(dirName);

  /*
  if (t.includes(path.delimiter) && t.includes(" ")) {
    t = t.substring(0, t.lastIndexOf(path.delimiter)) + t.substring(t.lastIndexOf(path.delimiter), t.length).replaceAll(" ", "_");
    console.log("REWRITTEN");
    console.log(test);
  }*/

  fs.writeFileSync(t, content);
}

function createFileStructure(name, setPath) {
  //create overall folder
  makeFolder(setPath, name);

  //Everything is put into this folder
  tempDir = setPath + path.sep + name + path.sep;

  //create top layer in folder structure

  //the mimetype will be added when zipping!
  //FileSystemManager.makeFile(tempDir, "mimetype", "application/epub+zip");
  makeFolder(tempDir, "META-INF");
  makeFile(tempDir + path.sep + "META-INF" + path.sep, "container.xml", EPUBFileCreator.containerFile);
  makeFile(tempDir + path.sep + "META-INF" + path.sep, "com.apple.ibooks.display-options.xml", EPUBFileCreator.iBooksOptions);

  //Create OEBPS AND ALL THE FOLDERS and FILES INSIDE
  makeFolder(tempDir, "OEBPS");
  //set the tempDir one layer below
  tempDir = tempDir + path.sep + "OEBPS" + path.sep;
  //create all of the folders inside this one
  makeFolder(tempDir, "audio");
  makeFolder(tempDir, "css");
  makeFolder(tempDir, "fonts");
  makeFolder(tempDir, "images");
  makeFolder(tempDir + path.sep + "images" + path.sep, "notice");
  makeFolder(tempDir, "Misc");
  makeFolder(tempDir, "xhtml");
}

exports.createFileStructure = createFileStructure;
exports.makeFile = makeFile;
exports.makeFolder = makeFolder;
