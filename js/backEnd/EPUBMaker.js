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
const Metadata = require("./classes/Metadata.js");

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

//elements belonging in the spine shall be here
let spine = [];

function setDirectory(d) {
  directory = d;
}

function fetchFromFrontend(window, callback) {
  window.webContents.executeJavaScript('sessionStorage.getItem("frontendData")', true).then((result) => {
    callback(result);
  });
}

function make(metadata, pages, data) {
  directory.then((value) => {
    data.languages.forEach((language) => {
      //this picks the name of the epub, according to how many files are in the folder,
      let dirName = "TestEpub" + "_" + language;
      let count = 1;

      //if folder with that name exists, add (*) at the end.
      if (fs.existsSync(value["filePaths"][0] + "\\" + dirName)) {
        while (fs.existsSync(value["filePaths"][0] + "\\" + dirName + "(" + count + ")")) {
          count = count + 1;
        }
        dirName = dirName + "(" + count + ")";
      }

      FileSystemManager.createFileStructure(dirName, value["filePaths"][0]);
      //import all of the required files!
      let files = fileImporter.import(pages, language);
      fileImporter.printImportedFiles();
      //writes the xhtml files into that new file structure
      XHTMLMaker.initialize(metadata, language, pages);
      XHTMLMaker.createXHTMLFiles(files, value["filePaths"][0], dirName);
      makeEPUB(dirName);
    });
  });
}

/**
 * Creates the epub file
 *
 * @param {*} n name of the file
 */
function makeEPUB(n) {
  directory.then((value) => {
    ZipHandler.makeEPUB(value["filePaths"][0] + "\\" + n + "\\").then(() => {
      fs.rename(value["filePaths"][0] + "\\" + n + ".zip", value["filePaths"][0] + "\\" + n + ".epub", (error) => {
        if (error) {
          // Show the error
          console.log("An Error occured:");
          console.log(n);
          console.log(error);
        } else {
          // List all the filenames after renaming
          console.log("\nFile Renamed\n");
          console.log(n);
        }
      });
    });
  });
}

function importImage(path) {
  return fileImporter.importImage(path);
}

function manuallySelectDependency(path) {
  fileImporter.manuallySelectDependency(path);
}

function setMetadata() {}

exports.fetchFromFrontend = fetchFromFrontend;
exports.importImage = importImage;
exports.manuallySelectDependency = manuallySelectDependency;
exports.setDirectory = setDirectory;
exports.makeEPUB = makeEPUB;
exports.make = make;
