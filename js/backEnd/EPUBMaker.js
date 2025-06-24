const FileSystemManager = require("./utilities/fileSystemUtility.js");
const PathUtilities = require("./utilities/pathUtilities.js");
const ZipHandler = require("./utilities/zipHandler.js");
const FileImporter = require("./fileImporter.js");
const XHTMLMaker = require("./xhtmlMaker.js");
const MetadataManager = require("./metadataManager.js");
const PageManager = require("./pageManager.js");
const Language = require("./classes/Languages.js");

let fs = require("fs");
const { fileURLToPath } = require("url");
const { shell } = require("electron");
const Metadata = require("./classes/Metadata.js");
const path = require("path");

//set this to null to let the user pick for themselves
//let directory = null;
let directory = new Promise((value) => {
  const path = {
    canceled: false,
    filePaths: ["C:\\Users\\ak127746\\Desktop\\Testing Folder"],
  };
  value(path);
});
let newDirName;
let language = "";
let fileImporter = new FileImporter();

let options = [];
let window;

//elements belonging in the spine shall be here
let spine = [];

function setDirectory(d) {
  console.log("Set Directory!");

  directory = d;
}

function fetchFromFrontend(w, callback) {
  window = w;
  window.webContents.executeJavaScript('sessionStorage.getItem("frontendData")', true).then((result) => {
    callback(result);
  });
}

function make(metadata, pages, data) {
  XHTMLMaker.initialize(metadata, pages, data);

  fileImporter.setFiles();

  data.languages.forEach((language) => {
    //this picks the name of the epub, according to how many files are in the folder,
    let dirName = data.dirName + "_" + language;
    let count = 1;

    console.log(directory);

    //if folder with that name exists, add (*) at the end.
    if (fs.existsSync(directory + path.sep + dirName)) {
      while (fs.existsSync(directory + path.sep + dirName + "(" + count + ")")) {
        count = count + 1;
      }
      dirName = dirName + "(" + count + ")";
    }

    console.log(dirName + " " + directory);
    FileSystemManager.createFileStructure(dirName, directory);
    //import all of the required files!
    let files = fileImporter.import(pages, language);
    //fileImporter.printImportedFiles();
    //writes the xhtml files into that new file structure

    XHTMLMaker.setLanguage(language);
    XHTMLMaker.createXHTMLFiles(files, directory, dirName);
    makeEPUB(dirName, data.launch);
  });
}

/**
 * Creates the epub file
 *
 * @param {*} fileName name of the file
 */
function makeEPUB(fileName, launchCheck) {
  ZipHandler.makeEPUB(directory + path.sep + fileName + path.sep).then(() => {
    fs.rename(directory + path.sep + fileName + ".zip", directory + path.sep + fileName + ".epub", (error) => {
      if (error) {
        // Show the error
        console.log("An Error occured:");
        console.log(error);
      } else {
        // List all the filenames after renaming
        console.log("\nFile Renamed\n");
        window.webContents.send("publishSuccessful");
        if (launchCheck == true) shell.openPath(directory + path.sep + fileName + ".epub");
      }
    });
  });
}

function importImage(path) {
  return fileImporter.importImage(path);
}

function manuallySelectDependency(path) {
  fileImporter.manuallySelectDependency(path);
}

function manuallySelectDependency2(path) {
  fileImporter.manuallySelectDependency2(path);
}

function importScriptsFromJSON(json) {
  fileImporter.importScriptsFromJSON(json);
}

exports.importScriptsFromJSON = importScriptsFromJSON;
exports.fetchFromFrontend = fetchFromFrontend;
exports.importImage = importImage;
exports.manuallySelectDependency = manuallySelectDependency;
exports.manuallySelectDependency2 = manuallySelectDependency2;
exports.setDirectory = setDirectory;
exports.makeEPUB = makeEPUB;
exports.make = make;
