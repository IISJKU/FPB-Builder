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
    ipcMain.on("selectDirectory", async () => {
      const value = await dialog.showOpenDialog({ properties: ["openDirectory"] });
      EPUBMaker.setDirectory(value);
      this.window.webContents.send("directorySet", value);
    });
    ipcMain.on("narrations", (event, defPath, element, lang) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          defaultPath: defPath,
          filters: [
            {
              name: "Audio",
              extensions: ["wav", "mp3"],
            },
          ],
        })
        .then((result) => {
          event.reply("narrationLoaded", result, element, lang);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    ipcMain.on("coverImage", (event, defPath, element, lang) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          defaultPath: defPath,
          filters: [
            {
              name: "jpeg/jpg",
              extensions: ["jpeg", "jpg"],
            },
          ],
        })
        .then((result) => {
          event.reply("coverLoaded", result, element, lang);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    ipcMain.on("otherFiles", (event, defPath, element) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          defaultPath: defPath,
        })
        .then((result) => {
          event.reply("setPath", result, element);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    ipcMain.on("loadJSON", (event, name) => {
      fs.readFile(app.getPath("userData") + "//projects//" + name + ".json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        EPUBMaker.importScriptsFromJSON(jsonString);
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
      console.log("Raw data!!");
      console.log(rawData);

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
    ipcMain.on("importImage", (event, defPath) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          defaultPath: defPath,
          filters: [
            {
              name: "xhtml",
              extensions: ["xhtml"],
            },
          ],
        })
        .then((value) => {
          if (value["filePaths"] == "" || value["filePaths"] == undefined || value["filePaths"][0] == "" || value["filePaths"][0] == undefined) return;
          let dependencyList = EPUBMaker.importImage(value["filePaths"][0]);
          this.window.webContents.send("imageLoaded", dependencyList);
        });
    });

    //manually import dependency
    ipcMain.on("importDependency", (event, arg) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
        })
        .then((value) => {
          if (value["filePaths"] == "" || value["filePaths"] == undefined || value["filePaths"][0] == "" || value["filePaths"][0] == undefined) return;
          EPUBMaker.manuallySelectDependency(value["filePaths"][0]);
        });
    });

    //manually import dependency with arguments
    ipcMain.on("importDependency2", (event, arg) => {
      EPUBMaker.manuallySelectDependency2(arg);
    });

    ipcMain.on("selectFont", (event, arg) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          filters: [
            {
              name: "ttf/otf",
              extensions: ["ttf", "otf"],
            },
          ],
        })
        .then((value) => {
          if (value["filePaths"] == "" || value["filePaths"] == undefined || value["filePaths"][0] == "" || value["filePaths"][0] == undefined) return;
          this.window.webContents.send("fontSet", value.filePaths[0]);
        });
    });
    ipcMain.on("saveSettings", (event, lang) => {
      shared.saveSettings(lang);
    });
    ipcMain.on("reloadRecentProjects", (event, arg) => {
      if (!fs.existsSync(app.getPath("userData") + "//projects")) {
        fs.mkdirSync(app.getPath("userData") + "//projects");
      }
      let projects = fs.readdirSync(app.getPath("userData") + "//projects//");
      let loadedProjects = new Array();

      if (Array.isArray(projects)) {
        projects.forEach((project) => {
          loadedProjects.push(JSON.parse(fs.readFileSync(app.getPath("userData") + "//projects//" + project, { encoding: "utf8" })));
        });
      }
      this.window.webContents.send("recentProjectsLoaded", loadedProjects);
    });
  }
}

module.exports = ipcMainManager;
exports.importedFiles = importedFiles;
