class FrontendDataManager {
  emptyMeta = {
    Title: {},
    Identifier: {},
    SourceISBN: "",
    Description: {},
    Author: [],
    Contributor: [],
    Publisher: [],
    PublishingDate: [],
    Copyright: "",
    AccessMode: {},
    AccessModeSufficient: [],
    AccessibilityFeature: [],
    AccessibilityHazard: [],
    AccessibilitySummary: {},
    CertifiedBy: [],
    ConformsTo: [],
  };
  languages;
  meta;

  constructor() {
    this.meta = this.emptyMeta;
  }

  sendDataToBackend(pageName) {
    let meta = this.emptyMeta;
    switch (pageName) {
      case "Project":
        let dir = $("#directory").val();
        if (dir != 0 && dir != undefined && dir != "Browse" && dir != "") {
          dir = undefined;
        }
        this.languages = JSON.parse(sessionStorage.getItem("pubLang"));

        /*
        if (typeof this.languages != "undefined") {
          metadataManager.setLanguages(this.languages);
        }*/

        break;
      case "Metadata":
        // get all of the elements in the container, and get to where the data is stored!
        let bookDataObj = parseSessionData("bookDetails");
        for (let fieldName in bookDataObj) {
          for (let fieldVal in bookDataObj[fieldName]) {
            if (isLanguageDependent(fieldName)) meta[fieldName][fieldVal] = bookDataObj[fieldName][fieldVal];
            else if (!meta[fieldName].includes(bookDataObj[fieldName][fieldVal])) {
              meta[fieldName].push(bookDataObj[fieldName][fieldVal]);
            }
          }
        }

        //set into session, so it can be read from the "metadata" tab in frontend
        sessionStorage.setItem("bookDetails", JSON.stringify(meta));

        break;
      case "Spine":
        break;
      case "Review & Publish":
        break;
    }
  }

  //write a function that sets this data to a json file, so it can be loaded again

  //also would be possible to set all of the text from the json from here
}

function isLanguageDependent(field) {
  return langMetadata.includes(field);
}
