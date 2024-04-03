const { dialog, ipcMain } = require("electron");
const storage = require("electron-json-storage");
const EPUBMaker = require("./EPUBMaker.js");

let fs = require("fs");

const importedFiles = [];

class ipcMainManager {
  window;
  constructor() {
    ipcMain.on("selectDirectory", () => {
      EPUBMaker.setDirectory(
        dialog.showOpenDialog({
          properties: ["file"],
        })
      );
    });

    //lets the user print the filepath to console
    ipcMain.on("printDirectory", () => {
      if (EPUBMaker.getDirectory() != null) {
        //dialog.showOpenDialog returns promise object, so we have to do it like this
        EPUBMaker.getDirectory().then((value) => {
          console.log(value["filePaths"][0]);
        });
      }
    });

    ipcMain.on("generateEpubs", () => {
      EPUBMaker.make();
    });

    //Allows you to import a file!#
    //Still testing this out, this will be the one where xhtml gets imported & the file is scanned for imports
    ipcMain.on("importFile", () => {
      /*
    let asd = dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "xhtml Files", extensions: ["xhtml"] }],
    });*/

      //this hardcodes the location of picked file, i did this, to make it easier to work with
      //this will be removed in actual code
      selectedFiles = new Promise((value) => {
        const path = {
          canceled: false,
          filePaths: [
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page01-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page02-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page03-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page04-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page05-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page06-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page07-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page08-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page09-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page10-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page11-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page12-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page13-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page14-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page15-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page16-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page17-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page18-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page19-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page20-fig.xhtml",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page21-fig.xhtml",
          ],
        };
        value(path);
      });

      //the generation should happen somewhere else
      EPUBMaker.createFileStructure();

      selectedFiles.then((selectedFile) => {
        selectedFile["filePaths"].forEach((file) => {
          if (fs.existsSync(file)) {
            let data = fs.readFileSync(file, "utf8");
            //split file at linebreaks to parse it line by line
            dataSplit = data.split("\n");
            if (checkIfImage(dataSplit)) {
              //this is responsible for adding every file to the list of imported files
              importDependencies(dataSplit, file);
              console.log(importedFiles);
              importedFiles.push(file);
            } else {
              //please select an image file!!
              console.log("Please Select an xhtml containing an image!");
            }
          }
        });
      });

      //here, all of the entries in the array will be moved to the new folder and sorted accordingly
      //paths contained in js and css will be replaced with old ones.
      EPUBMaker.importSelectedFiles(importedFiles);
    });

    ipcMain.on("importImage", () => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          filters: ["xhtml"],
        })
        .then((value) => {
          EPUBMaker.importImage(value["filePaths"][0]);
        });
    });

    //manually import dependency
    ipcMain.on("importDependency", () => {
      console.log(JSON.parse(storage.getSync("dependencies")));
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
