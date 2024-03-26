const Language = require("./classes/Languages.js");
const Metadata = require("./classes/Metadata.js");
const ProjectSettings = require("./projectSetting.js");

const languages = [];
const details = ""; // maybe rename this "field"
const metadata = [];

function fetchDataFromFrontend() {
  //get object bookDetails from session storage, but im defining it here, for testing puroses
  var bookDetails = {
    Title: {
      EN: "Little Red Riding Hood",
      IT: "Cappuccetto Rosso",
    },
    Identifier: {
      EN: "978-0-5490-2195-4",
      IT: "978-0-5490-2196-4",
    },
    Contributor: {
      1: "Viviano Pierpaolo",
      2: "Maëlie Celestine",
      3: "Vincentas Élisabeth",
      4: "Agata Lia",
    },
  };

  details = JSON.stringify(bookDetails);

  //get list of selected Languages from session, now I'm going to add test language data
  languages.push(Language.English);
  languages.push(Language.Italian);
}

//check if necessary data is here!
function validateMetadata() {
  languages.forEach((lang) => {
    let meta = new Metadata();
    let identifierCheck = false;
    let titleCheck = false;

    meta.language = lang;

    //change strings in brackets, according to how they are called in the frontend
    //this checks whether or not the fields where filled in, and should prevent problems that arise down the line
    if (details["Title"] != undefined && details["Title"][lang] != undefined) {
      titleCheck = true;
      meta.title = details["Title"][lang];
    }
    if (details["Identifier"] != undefined && details["Identifier"][lang] != undefined) {
      identifierCheck = true;
      meta.identifier = details["Identifier"][lang];
    }
    if (details["Contributor"] != undefined && details["Contributor"][lang] != undefined) meta.contributor = details["Contributor"][lang];
    if (details["Creator"] != undefined && details["Creator"][lang] != undefined) meta.creator = details["Creator"][lang];
    if (details["Description"] != undefined && details["Description"][lang] != undefined) meta.description = details["Description"][lang];
    if (details["Format"] != undefined && details["Format"][lang] != undefined) meta.format = details["Format"][lang];
    if (details["Publisher"] != undefined && details["Publisher"][lang] != undefined) meta.format = details["Publisher"][lang];
    if (details["Relation"] != undefined && details["Relation"][lang] != undefined) meta.relation = details["Relation"][lang];
    if (details["Rights"] != undefined && details["Rights"][lang] != undefined) meta.rights = details["Rights"][lang];
    if (details["Source"] != undefined && details["Source"][lang] != undefined) meta.source = details["Source"][lang];
    if (details["Subject"] != undefined && details["Subject"][lang] != undefined) meta.subject = details["Subject"][lang];
    if (details["Type"] != undefined && details["Type"][lang] != undefined) meta.type = details["Type"][lang];

    if (!titleCheck || !identifierCheck) {
      console.log("Important metadata is missing!");
    } else {
      metadata.push(meta);
    }
  });
}

function getMetadata() {
  return metadata;
}

module.exports.getMetadata = getMetadata;
module.exports.fetchDataFromFrontend = fetchDataFromFrontend;
module.exports.validateMetadata = validateMetadata;
