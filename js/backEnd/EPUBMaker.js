const FileSystemManager = require("./utilities/fileSystemUtility.js");
const EPUBFileCreator = require("./epubFiles.js");
const PathUtilities = require("./utilities/pathUtilities.js");
const ZipHandler = require("./utilities/zipHandler.js");
const FileImporter = require("./fileImporter.js");
const XHTMLMaker = require("./xhtmlMaker.js");
const MetadataManager = require("./metadataManager.js");
const PageManager = require("./pageManager.js");
const Language = require("./classes/Languages.js");

let fs = require("fs");
const { fileURLToPath } = require("url");

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

function createFileStructure(name, path) {
  //create overall folder
  FileSystemManager.makeFolder(path, name);

  //Everything is put into this folder
  tempDir = path + "\\" + name + "\\";

  //create top layer in folder structure

  //the mimetype will be added when zipping!
  //FileSystemManager.makeFile(tempDir, "mimetype", "application/epub+zip");
  FileSystemManager.makeFolder(tempDir, "META-INF");
  FileSystemManager.makeFile(tempDir + "\\META-INF\\", "container.xml", EPUBFileCreator.containerFile);
  FileSystemManager.makeFile(tempDir + "\\META-INF\\", "com.apple.ibooks.display-options.xml", EPUBFileCreator.iBooksOptions);

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
}

function make() {
  //get list of selected Languages from session, now I'm going to add test language data
  let languages = [];
  languages.push(Language.English);
  languages.push(Language.Italian);
  languages.push(Language.German);
  languages.push(Language.French);
  languages.push(Language.Lithuanian);

  MetadataManager.setLanguages(languages);
  MetadataManager.fetchMetadataFromFrontend();

  PageManager.fetchPageDataFromFrontend();
  console.log("I do something!");
  if (MetadataManager.validate()) {
    metadata = MetadataManager.getMetadata();

    directory.then((value) => {
      languages.forEach((language) => {
        //this picks the name of the epub, according to how many files are in the folder,

        /*let numFiles = fs.readdirSync(value["filePaths"][0]).filter((n) => {
          !n.includes(".epub");
        }).length;*/
        let numFiles =
          fs.readdirSync(value["filePaths"][0]).filter((na) => {
            return na.includes(".epub");
          }).length + 1;
        dirName = "TestEpub" + "_" + numFiles + "_" + language;
        createFileStructure(dirName, value["filePaths"][0]);
        //import all of the required files!
        let pages = PageManager.getPages();
        let files = fileImporter.import(pages, language);
        //writes the xhtml files into that new file structure
        XHTMLMaker.initialize(MetadataManager.getMetadata(), language, pages);
        XHTMLMaker.createXHTMLFiles(files, value["filePaths"][0], dirName);
        makeEPUB(dirName);
      });
    });
  }
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

exports.importImage = importImage;
exports.manuallySelectDependency = manuallySelectDependency;
exports.setDirectory = setDirectory;
exports.makeEPUB = makeEPUB;
exports.make = make;
