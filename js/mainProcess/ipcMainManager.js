const { dialog, ipcMain } = require("electron");

const EPUBMaker = require("./EPUBMaker.js");
const PathUtilities = require("./pathUtilities.js");
let fs = require("fs");
const path = require("path");
const importedFiles = [];

//sets up a function that lets the user pick a path from the file explorer
ipcMain.on("selectDirectory", () => {
  EPUBMaker.setDirectory(
    dialog.showOpenDialog({
      properties: ["openDirectory"],
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

//Here, the Files will be generated, this is still under construction!
ipcMain.on("generateTestFiles", () => {
  EPUBMaker.createFileStructure();
});

//Allows you to import a file!#
//Still testing this out, this will be the one where xhtml gets imported & the file is scanned for imports
//
// TODO: Check Whether or not this even contains an image
//
ipcMain.on("importFile", () => {
  let asd = dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "xhtml Files", extensions: ["xhtml"] }],
  });

  asd.then((selectedFile) => {
    //this file is the one that should be selected, move this code above!

    let src = selectedFile["filePaths"][0];

    //this opperation cuts of the last bit of the string, that contains the filename
    let srcSplit = src.split("\\");

    //fs.copyFile(src, dest, (err) => {

    if (fs.existsSync(src)) {
      fs.readFile(src, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        //split file at linebreaks to parse it line by line
        dataSplit = data.split("\n");
        if (checkIfImage(dataSplit)) {
          importDependencies(dataSplit, src);
          importedFiles.push(src);
          console.log("Sucess!");
          EPUBMaker.createFileStructure();
          EPUBMaker.importSelectedFiles(importedFiles);
        } else {
          //please select an image file!!
          console.log("Please Select an xhtml containing an image!");
        }
      });
    }

    //
    //
    //TODO: Move this to the place where stuff is getting sorted!
    // This is only here for testing porposes!
    //also: check if path is even set or files have already been created
  });
});

//looks through the line-array of the file, and finds the absolute path of the dependencies
function importDependencies(lineArray, src) {
  lineArray.forEach((element) => {
    let filename = "";
    if (element.includes("<link")) {
      filename = PathUtilities.cutOutFilename(element, "href");
    } else if (element.includes("<script")) {
      filename = PathUtilities.cutOutFilename(element, "src");
    }

    if (filename != "") {
      let t = PathUtilities.getAbsolutePath(src, filename);
      //check if the file was already imported!

      if (importedFiles.includes(t)) {
        //
        // TODO: Inform user that the file was included in a previous try
        //
      } else {
        //if it exists, add it to imported files, if not:
        //let the user manually select it.
        //
        // TODO: prompt the user to select it!!
        //
        if (fs.existsSync(t)) {
          importedFiles.push(t);
        } else {
          console.log("Success: False");
          //prompt user to select it here!
        }
      }
    }
  });
}

//checks if xhtml file is an image
function checkIfImage(lineArray) {
  let hasFigure = false;
  let hasSVG = false;
  lineArray.forEach((element) => {
    if (element.includes("<figure")) {
      hasFigure = true;
      console.log("This has a figure!");
    }
    if (element.includes("<svg")) {
      hasSVG = true;
    }
  });

  if (hasFigure == true && hasSVG == true) return true;
  return false;
}

exports.importedFiles = importedFiles;
