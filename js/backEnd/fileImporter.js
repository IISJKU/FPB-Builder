let fs = require("fs");
let PathUtilities = require("./utilities/pathUtilities.js");
const DependencyList = require("./classes/DependencyList.js");
const storage = require("electron-json-storage");

class FileImporter {
  importedFiles = [];
  images = [];
  dependencyMap = new Map();

  constructor() {
    this.importedFiles = new Array();
  }

  printImportedFiles() {
    console.log(this.importedFiles);
  }

  //checks if xhtml file is an image
  checkIfImage(lineArray) {
    let hasFigure = false;
    let hasSVG = false;
    lineArray.forEach((element) => {
      if (element.includes("<figure")) {
        hasFigure = true;
      }
      if (element.includes("<svg")) {
        hasSVG = true;
      }
    });

    if (hasFigure == true && hasSVG == true) return true;
    return false;
  }

  //looks through the line-array of the file, and finds the absolute path of the dependencies
  importDependencies(lineArray, src) {
    lineArray.forEach((element) => {
      let done = false;
      let index = 0;
      let round = 0;
      let filename = "";
      //this while loop allows us to look for multiple imports per line!
      while (!done) {
        filename = "";

        //check if line has tag after index
        let tline = element.substring(index, element.length);

        if (tline.includes("<link", index)) {
          filename = PathUtilities.cutOutFilename(tline, "href");
          index = tline.indexOf("href");
        } else if (tline.includes("<script", index)) {
          filename = PathUtilities.cutOutFilename(tline, "src");
          index = tline.indexOf("src");
        } else if (tline.includes("<source", index)) {
          filename = PathUtilities.cutOutFilename(tline, "src");
          index = tline.indexOf("src");
        }
        index = index + 1;

        if (filename != "") {
          let t = PathUtilities.getAbsolutePath(src, filename);
          //check if the file was already imported!
          if (round == 1) {
            console.log(t);
          }

          if (this.importedFiles.includes(t)) {
            //
            // TODO: Inform user that the file was included in a previous try
            //
            //console.log("file already contained " + t);
          } else {
            //if it exists, add it to imported files, if not:
            //let the user manually select it.
            //
            // TODO: prompt the user to select it!!
            //

            if (fs.existsSync(t)) {
              this.importedFiles.push(t);
            } else {
              console.log("Success: False");
              //prompt user to select it here!
            }
          }
        } else {
          done = true;
        }
        round = round + 1;
        filename = "";
      }
    });
  }

  //this function gets called, when a dependency has to be manually selected
  manuallySelectDependency(path) {
    let name = path.substring(path.lastIndexOf("\\") + 1, path.length);
    ////////////////////////////////////////
    //
    //  TODO: Maybe do some validation
    //
    ////////////////////////////////////////

    this.dependencyList.found(name);
    this.importedFiles.push(path);
    this.dependencyMap.set(name, path);
  }

  /**
   *  looks through the line-array of the file, and finds the absolute path of the dependencies
   *  saves a list of files to storage, that are
   * @param {String} src the path to the file
   */
  importImage(src) {
    let dependencyList = new DependencyList();

    let data = fs.readFileSync(src, "utf8");
    //split file at linebreaks to parse it line by line
    let lineArray = data.split("\n");

    if (this.checkIfImage(lineArray)) {
      dependencyList.isImage = true;

      lineArray.forEach((element) => {
        let done = false;
        let index = 0;
        let round = 0;
        let filename = "";

        //this while loop allows us to look for multiple imports per line!
        while (!done) {
          filename = "";

          //check if line has tag after index
          let tline = element.substring(index, element.length);

          if (tline.includes("<link", index)) {
            filename = PathUtilities.cutOutFilename(tline, "href");
            index = tline.indexOf("href");
          } else if (tline.includes("<script", index)) {
            filename = PathUtilities.cutOutFilename(tline, "src");
            index = tline.indexOf("src");
          } else if (tline.includes("<source", index)) {
            filename = PathUtilities.cutOutFilename(tline, "src");
            index = tline.indexOf("src");
          }
          index = index + 1;

          if (filename != "") {
            let t = PathUtilities.getAbsolutePath(src, filename);
            let shortName = t.substring(t.lastIndexOf("\\") + 1, t.length);

            //check if the file was already imported!
            if (this.dependencyMap.has(shortName)) {
              //already imported
              dependencyList.found(shortName);
            } else {
              //if it exists, add it to imported files, if not:
              //let the user manually select it.
              if (fs.existsSync(t)) {
                this.importedFiles.push(t);
                this.dependencyMap.set(shortName, t);
                dependencyList.found(shortName);
              } else {
                console.log("didnt find: " + shortName);
                dependencyList.missing(shortName);
                //prompt user to select it here!
              }
            }
          } else {
            done = true;
          }
          round = round + 1;
          filename = "";
        }
      });
    } else {
      dependencyList.isImage = false;
    }

    dependencyList.imageFile = src.substring(src.lastIndexOf("\\") + 1, src.length);
    let d = JSON.stringify(dependencyList);
    return dependencyList;
    //storage.set("dependencies", d);
  }

  /**
   * Loads all the files into an array, after they are checked!
   * @param {Page[]} pages - the raw page data
   * @param {Language} lang - The Language the files are in
   * @returns An array containing the imported files
   */
  import(pages, lang) {
    this.importedFiles = [];
    pages.forEach((page) => {
      if (page.title != ("credit" || "cover") && fs.existsSync(page.imagesScripts.Image)) {
        let data = fs.readFileSync(page.imagesScripts.Image, "utf8");
        //split file at linebreaks to parse it line by line
        let dataSplit = data.split("\n");
        if (this.checkIfImage(dataSplit)) {
          //this is responsible for adding every file to the list of imported files
          this.importDependencies(dataSplit, page.imagesScripts.Image);
          this.importedFiles.push(page);
          this.importedFiles.push(page.imagesScripts.Image);
          this.importedFiles.push(page.narration[lang]);
          //console.log(importedFiles);
        } else {
          //please select an image file!!
          console.log("Please Select an xhtml containing an image!");
        }
      } else if (page.title != "credit" && (page.imagesScripts.Image == "" || page.imagesScripts.Image == undefined)) {
        if (page.title != "cover" && page != "") {
          this.importedFiles.push(page);
          if (page.narration[lang] != "") this.importedFiles.push(page.narration[lang]);
        }
      }
    });
    return this.importedFiles;
  }
}

module.exports = FileImporter;
