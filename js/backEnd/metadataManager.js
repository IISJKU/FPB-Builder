const Language = require("./classes/Languages.js");
const Metadata = require("./classes/Metadata.js");
const ErrorList = require("./classes/ErrorList.js");
const storage = require("electron-json-storage");

let languages = [];
let details = ""; // maybe rename this "field"
let window;
let metadata;

function setLanguages(lang) {
  languages = lang;
}

/**
 *  Metadata is fetched out of the session storage.
 * At the moment, all data used is dummy data.
 */

function fetchMetadataFromFrontend() {
  //get object bookDetails from session storage, but im defining it here, for testing puroses
  let bookDetails = {
    Title: {
      EN: "Little Red Riding Hood",
      IT: "Cappuccetto Rosso",
      DE: "Rotkäppchen",
      FR: "Le petit Chaperon rouge",
      LIT: "Raudonkepuraitė",
    },
    Identifier: {
      EN: "978-0-5490-2195-4",
      IT: "978-0-5490-2196-4",
      DE: "978-0-5490-2196-4",
      FR: "978-0-5490-2196-4",
      LIT: "978-0-5490-2196-4",
    },
    SourceISBN: "978-3-4461-4916-8",
    Description: {
      EN: "This is the description This is the description This is the description ",
      IT: "Questa è la descrizione Questa è la descrizione Questa è la descrizione",
      DE: "Das ist die Beschreibung Das ist die Beschreibung Das ist die Beschreibung",
      FR: "C'est la description, c'est la description, c'est la description",
      LIT: "Tai yra aprašymas Tai yra aprašymas Tai yra aprašymas",
    },
    Author: ["Les doigts qui rêvent"],
    Contributor: ["Viviano Pierpaolo", "Maëlie Celestine", "Vincentas Élisabeth", "Agata Lia"],
    Publisher: "LDQR",
    Copyright: "2022 LDQR",
    AccessMode: ["textual"],
    AccessModeSufficient: ["auditory", "visual"],
    AccessibilityFeature: ["alternativeAudio", "alternativeText"],
    AccessibilityHazard: ["sound"],
    AccessibilitySummary: {
      EN: "This is the english accessability summary",
      IT: "Questo è il riepilogo italiano dell'accessibilità",
      DE: "Dies ist die italienische Zusammenfassung der Barrierefreiheit",
      FR: "Ceci est le résumé italien de l'accessibilité",
      LIT: "Tai itališka prieinamumo santrauka",
    },
  };

  details = bookDetails;
}

/**
 * Checks if the necessary data is here.
 * Adds an ErrorList, containing all missing Data into the storage
 *
 * @returns True, if all the neccessary data is here.
 */
//prettier-ignore
function validate() {
  //fetches the error list from the session storage
  metadata = new Metadata();

  let errorList = new ErrorList();

  
  //validate unique fields
  if (details["AccessMode"] != undefined && details["AccessMode"].length != 0) {
    metadata.accessMode = details["AccessMode"];
  } else {
    errorList.metadata.accModeMissing.push("missing");
  }
  if (details["AccessModeSufficient"] != undefined && details["AccessModeSufficient"].length != 0) {
    metadata.accessibilityModeSufficcient = details["AccessModeSufficient"];
  } else {
    errorList.metadata.accModeSufficcientMissing.push("missing");
  }
  if (details["AccessibilityFeature"] != undefined && details["AccessibilityFeature"].length != 0) {
    metadata.accessibilityFeature = details["AccessibilityFeature"];
  } else {
    errorList.metadata.accFeatureMissing.push("missing");
  }
  if (details["AccessibilityHazard"] != undefined && details["AccessibilityHazard"].length != 0) {
    metadata.accessibilityHazard = details["AccessibilityHazard"];
  } else {
    errorList.metadata.accHazardMissing.push("missing");
  }
  if (details["Author"] != undefined && details["Author"].length != 0) {
    metadata.authors = details["Author"];
  } 
  if (details["Copyright"] != undefined && details["Copyright"].length != 0) {
    metadata.copyright = details["Copyright"];
  } 
  if (details["SourceISBN"] != undefined && details["SourceISBN"].length != 0) {
    metadata.sourceISBN = details["SourceISBN"];
  } 

  //check for each language if the required metadata is here!
  languages.forEach((lang) => {
    metadata.language.push(lang);
    //
    // Necessary Metadata
    //
    if (details["Title"] != undefined && details["Title"][lang] != undefined) { 
      metadata.title[lang] = details["Title"][lang];
    } else {
      errorList.metadata.titleMissing.push(lang);
    }
    if (details["Identifier"] != undefined && details["Identifier"][lang] != undefined) {
      metadata.identifier[lang] = details["Identifier"][lang];
    } else {
      errorList.metadata.identifierMissing.push(lang);
    }
    if (details["AccessibilitySummary"] != undefined && details["AccessibilitySummary"][lang] != undefined) {
      metadata.accessibilitySummary[lang] = details["AccessibilitySummary"][lang]
    } else {
      errorList.metadata.accSummaryMissing.push("missing");
    }
    if (details["Description"] != undefined && details["Description"].length != 0) {
      metadata.description[lang] = details["Description"][lang];
    }
  });
    //
    //  Important but not mandataory
    //
  if (details["Contributor"] != undefined && details["Contributor"].length != 0) {
    metadata.contributor = details["Contributor"];
  }
  if (details["Creator"] != undefined && details["Creator"].length != 0) {
    metadata.creator = details["Creator"];
  }
  if (details["Format"] != undefined && details["Format"].length != 0) {
    metadata.format = details["Format"];
  }
  if (details["Publisher"] != undefined && details["Publisher"].length != 0) {
    metadata.publisher = details["Publisher"];
  }
  if (details["Relation"] != undefined && details["Relation"].length != 0) {
    metadata.relation = details["Relation"];
  }
  if (details["Rights"] != undefined && details["Rights"].length != 0) {
    metadata.rights = details["Rights"];
  }
  if (details["Source"] != undefined && details["Source"].length != 0) {
    metadata.source = details["Source"];
  }
  if (details["Subject"] != undefined && details["Subject"].length != 0) {
    metadata.subject = details["Subject"];
  }
  if (details["Type"] != undefined && details["Type"].length != 0) {
    metadata.type = details["Type"];
  }

  let er = JSON.stringify(errorList);
  storage.set("errors", er);

  console.log(errorList);

  return errorList.isEmpty();
}

function getMetadata() {
  return metadata;
}

module.exports.getMetadata = getMetadata;
module.exports.setLanguages = setLanguages;
module.exports.fetchMetadataFromFrontend = fetchMetadataFromFrontend;
module.exports.validate = validate;
