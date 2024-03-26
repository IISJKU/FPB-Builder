const { dialog, ipcMain } = require("electron");

const EPUBMaker = require("./EPUBMaker.js");
const EPUBMaker2 = require("./EPUBMaker2.js");
const PathUtilities = require("./utilities/pathUtilities.js");
let fs = require("fs");

const importedFiles = [];
const MetadataManager = require("./metadataManager.js");
const PageManager = require("./pageManager.js");

/////////////////////
//
// TODO: REMOVE THESE CLASS DEFINITIONS
//
//

//make an object that holds everything of the double page
function Page(Image, Text) {
  this.Image = Image;
  this.Text = Text;
}

function Image(src, altText) {
  this.src = src;
  this.altText = altText;
}

function Text(title, lang, text, audio) {
  this.title = title;
  this.lang = lang;
  this.text = text; //test with multi line inputs
  this.audio = audio;
}

/////////////////////

class ipcMainManager {
  window;
  constructor(window) {
    this.window = window;
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

    ipcMain.on("generateEpubs", () => {
      //get list of selected Languages from session, now I'm going to add test language data
      let languages = [];
      languages.push(Language.English);
      languages.push(Language.Italian);

      MetadataManager.setLanguages(languages);
      MetadataManager.fetchMetadataFromFrontend();

      PageManager.fetchPageDataFromFrontend();

      if (MetadataManager.validate()) {
        languages.forEach((lang) => {
          EPUBMaker2.make(MetadataManager.getMetadata(), PageManager.getPages(), lang);
        });
      }

      //console.log("ye");

      //EPUBMaker.createFileStructure();

      //EPUBMaker.setPages(pages);
      //EPUBMaker.importSelectedFiles(importedFiles);
      //EPUBMaker.makeEPUB();
    });

    //Here, the Files will be generated, this is still under construction!
    ipcMain.on("generateTestFiles", () => {
      EPUBMaker.createFileStructure();

      //
      //
      //testing stuff
      const coverImage = "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\images\\cover.jpg";
      const coverNarration = "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\EMILE_-_Page_de_faux_titre_V1.mp3";

      EPUBMaker.makeCover("Buchdeckel", coverImage, "Buchdeckel: Ben will eine Fledermaus", coverNarration);
      importedFiles.push(coverImage);
      importedFiles.push(coverNarration);

      const pages = new Array();
      altText = "This is the alt text....";

      //All of this will come from the front end soon!
      pages.push(
        new Page(
          new Image("C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page01-fig.xhtml", altText),
          new Text("page01", "de", "Hello, this is the first page!", "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3")
        )
      );
      pages.push(
        new Page(
          new Image("C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page02-fig.xhtml", altText),
          new Text(
            "page02",
            "de",
            "On the second page..... \n nothing particular happens!",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3"
          )
        )
      );
      pages.push(
        new Page(
          new Image("C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page03-fig.xhtml", altText),
          new Text(
            "page03",
            "de",
            "Im testing \n some.... \n things \n ... \n",
            "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page03.mp3"
          )
        )
      );
      pages.push(
        new Page(
          new Image("C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page04-fig.xhtml", altText),
          new Text("page04", "de", "This is page 4", "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page04.mp3")
        )
      );
      pages.push(
        new Page(
          new Image("C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page05-fig.xhtml", altText),
          new Text("page05", "de", "this is the fifth one!", "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page05.mp3")
        )
      );
      pages.push(
        new Page(
          new Image("C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page06-fig.xhtml", altText),
          new Text("page06", "de", "Page \n \n numero 6", "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page06.mp3")
        )
      );

      pages.forEach((page) => {
        if (fs.existsSync(page.Image.src)) {
          let data = fs.readFileSync(page.Image.src, "utf8");
          //split file at linebreaks to parse it line by line
          dataSplit = data.split("\n");
          if (checkIfImage(dataSplit)) {
            //this is responsible for adding every file to the list of imported files

            importDependencies(dataSplit, page.Image.src);
            importedFiles.push(page.Text);
            importedFiles.push(page.Image.src);
            importedFiles.push(page.Text.audio);
            //console.log(importedFiles);
          } else {
            //please select an image file!!
            console.log("Please Select an xhtml containing an image!");
          }
        }
      });

      EPUBMaker.setPages(pages);
      EPUBMaker.importSelectedFiles(importedFiles);
      EPUBMaker.makeEPUB();
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

          if (importedFiles.includes(t)) {
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
              importedFiles.push(t);
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

  //checks if xhtml file is an image
  checkIfImage(lineArray) {
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
}

module.exports = ipcMainManager;
exports.importedFiles = importedFiles;
