const { dialog, ipcMain } = require("electron");
const FileSystemManager = require("./fileSystemManager.js");
const EPUBFileCreator = require("./epubFileCreator.js"); //VS Code gives me a warning, but its fine haha
let fs = require("fs");
const path = require("path");
let importedFiles = Array();

let selectedDirectory = null;
//sets up a function that lets the user pick a path from the file explorer
ipcMain.on("selectDirectory", () => {
  selectedDirectory = dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
});

//lets the user print the filepath to console
ipcMain.on("printDirectory", () => {
  if (selectedDirectory != null) {
    //dialog.showOpenDialog returns promise object, so we have to do it like this
    selectedDirectory.then((value) => {
      console.log(value["filePaths"][0]);
    });
  }
});

//Here, the Files will be generated, this is still under construction!
ipcMain.on("generateTestFiles", () => {
  selectedDirectory.then((value) => {
    //create overall folder
    FileSystemManager.makeFolder(value["filePaths"][0], "TestEpub");

    //Everything is put into this folder
    tempDir = value["filePaths"][0] + "\\TestEpub";

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
    //Create content,opf file
    FileSystemManager.makeFile(tempDir, "content.opf", EPUBFileCreator.createContentFile());
    //TODO Write function that fills this file!
    //
    // This function is WIP!
    //
    //create the TOC file
    FileSystemManager.makeFile(tempDir, "toc.ncx", EPUBFileCreator.createTOC());
  });
});

//Allows you to import a file!#
//Still testing this out, this will be the one where xhtml gets imported & the file is scanned for imports
ipcMain.on("importFile", () => {
  /*
  let asd = (selectedDirectory = dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "xhtml Files", extensions: ["xhtml"] }],
  }));

  asd.then((selectedFile) => {
    console.log(selectedFile);
    fs.copyFile()
    //Do all the stuff below this here, i just commented it out for testing!
  }); */

  //this file is the one that should be selected, move this code above!

  let src = "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page01-fig.xhtml";

  //this opperation cuts of the last bit of the string, that contains the filename
  let srcSplit = src.split("\\");
  let dest = "C:\\Users\\ak127746\\Desktop\\Testing Folder\\" + srcSplit[srcSplit.length - 1];

  fs.copyFile(src, dest, (err) => {
    if (err) {
      console.log("Error Found:", err);
    } else {
      fs.readFile(dest, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        //split file into at linebreaks to parse it line by line
        dataSplit = data.split("\n");
        dataSplit.forEach((element) => {
          if (element.includes("<link") || element.includes("<script")) {
            console.log(element);
          }
        });
      });
    }
  });
});
