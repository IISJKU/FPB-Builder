const { app, dialog, ipcMain } = require("electron");
const storage = require("electron-json-storage");
const EPUBMaker = require("./EPUBMaker.js");
const MetadataManager = require("./metadataManager.js");
const PageManager = require("./pageManager.js");
const shared = require("../shared.js");

let fs = require("fs");

const importedFiles = [];

class ipcMainManager {
  window;
  constructor(window) {
    this.window = window;
    ipcMain.on("selectDirectory", () => {
      EPUBMaker.setDirectory(
        dialog
          .showOpenDialog({
            properties: ["openDirectory"],
          })
          .then((value) => {
            this.window.webContents.send("directorySet", value);
          })
      );
    });
    ipcMain.on("narrations", (event, arg) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          filters: [
            {
              name: "Audio",
              extensions: ["wav", "mp3"],
            },
          ],
        })
        .then((result) => {
          event.reply("filePath", result.filePaths);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    ipcMain.on("coverImage", (event, arg) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          filters: [
            {
              name: "Images",
              extensions: ["jpg", "png", "jpeg"],
            },
          ],
        })
        .then((result) => {
          event.reply("filePath", result.filePaths);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    ipcMain.on("otherFiles", (event, arg) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          filters: [
            {
              name: "All Files",
              extensions: ["*"],
            },
          ],
        })
        .then((result) => {
          event.reply("filePath", result.filePaths);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    ipcMain.on("loadJSON", (event, name) => {
      fs.readFile(app.getPath("userData") + "\\projects\\"+ name+'.json', "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        event.reply("projectData", jsonString);
      });
    });

    ipcMain.on("saveDataBtn", (event) => {
      shared.saveData(window);
    });

    ///////////////////////////////////////////////////////////////

    //lets the user print the filepath to console
    ipcMain.on("printDirectory", () => {
      if (EPUBMaker.getDirectory() != null) {
        //dialog.showOpenDialog returns promise object, so we have to do it like this
        EPUBMaker.getDirectory().then((value) => {
          console.log(value["filePaths"][0]);
        });
      }
    });

    function dataLoaded(rawData) {
      rawData = JSON.parse(rawData);

      EPUBMaker.setDirectory(rawData.options.directory);
      MetadataManager.setLanguages(rawData.languages);
      PageManager.setLanguages(rawData.languages);

      MetadataManager.setData(rawData.bookDetails);
      PageManager.setData(rawData.pages);

      //check if stuff is valid!
      //if(MetadataManager.validates() && PageManager.validates()){}

      EPUBMaker.make(MetadataManager.getMetadata(), PageManager.getPages(), rawData);
    }

    ipcMain.on("generateEpubs", () => {
      EPUBMaker.fetchFromFrontend(this.window, dataLoaded);

      //MetadataManager.setLanguages(languages);

      //PageManager.fetchPageDataFromFrontend();

      //EPUBMaker.make();
    });

    //Allows you to import a file!#
    //Still testing this out, this will be the one where xhtml gets imported & the file is scanned for imports
    ipcMain.on("importImage", () => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          filters: ["xhtml"],
        })
        .then((value) => {
          let dependencyList = EPUBMaker.importImage(value["filePaths"][0]);
          this.window.webContents.send("imageLoaded", dependencyList);
        });
    });

    //manually import dependency
    ipcMain.on("importDependency", () => {
      //console.log(JSON.parse(storage.getSync("dependencies")));
      dialog
        .showOpenDialog({
          properties: ["openFile"],
        })
        .then((value) => {
          EPUBMaker.manuallySelectDependency(value["filePaths"][0]);
        });
    });
  }
}

module.exports = ipcMainManager;
exports.importedFiles = importedFiles;
