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
    AccessMode: [],
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
        let t = $("#selectedBox");
        t.children().each((val, element) => {
          if (typeof element != undefined) {
            let container = element.children[0].children[1];
            let fieldName = element.children[0].children[0].children[0].textContent;
            if (fieldName === "Creator") {
              fieldName = "Author";
            }

            switch (fieldName) {
              case "Creator":
                fieldName = "Author";
                break;
              case "Mode":
                fieldName = "AccessMode";
                break;
              case "Mode Sufficient":
                fieldName = "AccessModeSufficient";
                break;
              case "Summary":
                fieldName = "AccessibilitySummary";
                break;
              case "Hazard":
                fieldName = "AccessibilityHazard";
                break;
              case "Feature":
                fieldName = "AccessibilityFeature";
                break;
              case "Certified by":
                fieldName = "CertifiedBy";
                break;
              case "Conforms to":
                fieldName = "ConformsTo";
                break;
            }

            for (let i = 0; i < container.children.length; i++) {
              if (typeof container != undefined && typeof container.children[i] != undefined) {
                let lang = container.children[i].children[0].innerText;
                let value = container.children[i].children[1].innerText;
                //set the field accordingly
                if (isLanguageDependent(fieldName)) meta[fieldName][lang] = value;
                else if (!meta[fieldName].includes(value)) meta[fieldName].push(value);
              }
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
  return ["Title", "Identifier", "Description", "AccessibilitySummary"].includes(field);
}
