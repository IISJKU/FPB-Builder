class FrontendDataManager {
  emptyMeta = {
    Title: {},
    Identifier: {},
    SourceISBN: "",
    Description: {},
    Author: [],
    Contributor: [],
    Publisher: [],
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
        if (dir != 0 && dir != undefined && dir != "Click to set directory") {
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

        $("#selectedBox a").each(function () {
          let fieldName = $(this).attr("id");
          let rows = $(this).children("table").children("tbody").children("tr");
          for (let i = 0; i < rows.length; i++) {
            let lang = rows[i].children[0].textContent;
            let value = rows[i].children[1].textContent;

            console.log(lang + " " + value);
            console.log(fieldName + " " + value);
            if (isLanguageDependent(fieldName)) meta[fieldName][lang] = value;
            else if (!meta[fieldName].includes(value)) {
              meta[fieldName].push(value);
              console.log("ye");
            }
          }
        });

        //set into session, so it can be read from the "metadata" tab in frontend
        sessionStorage.setItem("bookDetails", JSON.stringify(meta));

        break;
      case "Spine":
        sessionStorage.setItem("pageDetails", JSON.stringify(pageDetails));
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
