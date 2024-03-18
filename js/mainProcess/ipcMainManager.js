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
  /*
  let asd = dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "xhtml Files", extensions: ["xhtml"] }],
  });*/

  //this hardcodes the location of picked file, i did this, to make it easier to work with
  //this will be removed in actual code
  asd = new Promise((value) => {
    const path = {
      canceled: false,
      filePaths: ["C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page02-fig.xhtml"],
    };
    value(path);
  });

  asd.then((selectedFile) => {
    //this file is the one that should be selected, move this code above!
    let src = selectedFile["filePaths"][0];

    //this opperation cuts of the last bit of the string, that contains the filename
    let srcSplit = src.split("\\");

    if (fs.existsSync(src)) {
      let data = fs.readFileSync(src, "utf8");

      //split file at linebreaks to parse it line by line
      dataSplit = data.split("\n");
      if (checkIfImage(dataSplit)) {
        //the generation should happen somewhere else, put afterwards
        EPUBMaker.createFileStructure();

        //this is responsible for adding every file to the list of imported files
        importDependencies(dataSplit, src);
        importedFiles.push(src);

        console.log("Imported Files:");
        importedFiles.forEach((filename) => {
          console.log(filename.substring(filename.lastIndexOf("\\") + 1, filename.length));
        });
        console.log("");

        //here, all of the entries in the array will be moved to the new folder and sorted accordingly
        //paths contained in js and css will be replaced with old ones.
        EPUBMaker.importSelectedFiles(importedFiles);
      } else {
        //please select an image file!!
        console.log("Please Select an xhtml containing an image!");
      }
    }
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
    } else if (element.includes("<source")) {
      filename = PathUtilities.cutOutFilename(element, "src");
    }

    if (filename != "") {
      let t = PathUtilities.getAbsolutePath(src, filename);
      //check if the file was already imported!

      if (importedFiles.includes(t)) {
        //
        // TODO: Inform user that the file was included in a previous try
        //
        console.log("File " + t + " was imported previously!");
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
