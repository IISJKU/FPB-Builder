//accessibility metadata options
//const accessMeta = ["Mode", "Feature", "Hazard", "Summary", "Mode Sufficient", "Conforms to", "Certified by"];
const accessMeta = ["AccessMode", "AccessibilityFeature", "AccessibilityHazard", "AccessibilitySummary", "AccessModeSufficient", "ConformsTo", "CertifiedBy"];
//required metadata
const reqMeta = ["Title", "Identifier", "AccessibilitySummary", "AccessModeSufficient"];
//Metdata that related to the selected languages in the project screen
const langMetadata = [
  "Title",
  "Identifier",
  "AccessMode",
  "AccessibilityFeature",
  "AccessibilityHazard",
  "AccessibilitySummary",
  "AccessModeSufficient",
  "Type",
  "Subject",
];
let bookDetails = {
  Title: {
    EN: "Little Red Riding Hood",
    IT: "Cappuccetto Rosso",
  },
  Identifier: {
    EN: "978-0-5490-2195-4",
    IT: "978-0-5490-2196-4",
  },
  SourceISBN: "",
  Description: {},
  Author: [],
  Contributor: {
    1: "Viviano Pierpaolo",
    2: "Maëlie Celestine",
    3: "Vincentas Élisabeth",
    4: "Agata Lia",
  },
  Publisher: [],
  Copyright: "",
  AccessMode: [],
  AccessModeSufficient: [],
  AccessibilityFeature: [],
  AccessibilityHazard: [],
  AccessibilitySummary: {},
  CertifiedBy: [],
  ConformsTo: [],
  PublishingDate: [],
};

sessionStorage.setItem("bookDetails", JSON.stringify(bookDetails));

let infoText = "More";
//info panel content object
let infoObj = {
  Title:
    "Represents an instance of a name for the EPUB publication. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-title'>" + infoText + "</a>",
  Identifier:
    "Contains an identifier such as a UUID, DOI or ISBN. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-identifier'>" + infoText + "</a>",
  Contributor:
    "Represent the name of a person, organization, etc. that played a secondary role in the creation of the content. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-contributor'>" +
    infoText +
    "</a>",
  Author:
    "Represents the name of a person, organization, etc. responsible for the creation of the content. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-creator'>" +
    infoText +
    "</a>",
  Publisher:
    "Refer to a publishing company or organization, or to an individual who leads a publishing company. <a target='_blank' href='https://www.w3.org/TR/epub-33/#sec-opf-dcmes-optional-def'>" +
    infoText +
    "</a>",
  PublishingDate:
    "Defines the publication date of the EPUB publication. The publication date is not the same as the last modified date. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-date'>" +
    infoText +
    "</a>",
  Subject:
    "Identifies the subject of the EPUB publication. The value should be human-readable heading or label, but a code value may used if the subject taxonomy does not provide a separate descriptive label. <a target='_blank' href='https://www.w3.org/TR/epub-33/#sec-opf-dcsubject'>" +
    infoText +
    "</a>",
  Type:
    "Used to indicate that the EPUB publication is of a specialized type (e.g., annotations or a dictionary packaged in EPUB format). <a target='_blank' href='https://www.w3.org/TR/epub-33/#sec-opf-dctype'>" +
    infoText +
    "</a>",
  AccessMode:
    "A human sensory perceptual system or cognitive faculty necessary to process or perceive the content (e.g., textual, visual, auditory, tactile). <a target='_blank' href='https://schema.org/accessMode'>" +
    infoText +
    "</a>",
  AccessibilityFeature:
    "Features and adaptations that contribute to the overall accessibility of the content (e.g., alternative text, extended descriptions, captions). <a target='_blank' href='https://schema.org/accessibilityFeature'>" +
    infoText +
    "</a>",
  AccessibilityHazard:
    "Any potential hazards that the content presents (e.g., flashing, motion simulation, sound). <a target='_blank' href='https://schema.org/accessibilityHazard'>" +
    infoText +
    "</a>",
  AccessibilitySummary:
    "A human-readable summary of the accessibility that complements, but does not duplicate, the other discoverability metadata. It also describes any known deficiencies (e.g., lack of extended descriptions, specific hazards). <a target='_blank' href='https://schema.org/accessibilitySummary'>" +
    infoText +
    "</a>",
  AccessModeSufficient:
    "A set of one or more access modes sufficient to consume the content without significant loss of information. The publication can have more than one set of sufficient access modes for its consumption depending on the types of content it includes. <a target='_blank' href='https://schema.org/accessModeSufficient'>" +
    infoText +
    "</a>",
  ConformsTo:
    "Identify the accessibility requirements or guidelines the publication follows. <a target='_blank' href='https://www.dublincore.org/specifications/dublin-core/dcmi-terms/terms/conformsTo/'>" +
    infoText +
    "</a>",
  CertifiedBy:
    "Identifies a party responsible for the testing and certification of the accessibility of an EPUB publication. <a target='_blank' href='https://www.w3.org/TR/epub-a11y-11/#certifiedBy'>" +
    infoText +
    "</a>",
};

let initialized = false;

function loadInMetadata() {
  let test = JSON.parse(sessionStorage.getItem("bookDetails"));
  console.log(test);
  // get all of the elements in the container, and get to where the data is stored!
  /*let t = $("#selectedBox");
  t.children().each((val, element) => {
    if (typeof element != undefined) {
      let container = element.children[0].children[1];
      let fieldName = element.children[0].children[0].children[0].val();
      for (let i = 0; i < container.children.length; i++) {
        if (typeof container != undefined && typeof container.children[i] != undefined) {
          let lang = container.children[i].children[0].innerText;
          let value = container.children[i].children[1].innerText;

          if (typeof test[fieldName] != undefined && typeof test[fieldName][lang] != undefined) {
            if (value == "" || value.length == 0 || typeof value == undefined) {
              if (isLanguageDependent(fieldName)) container.children[i].children[1].innerText = test[fieldName][lang];
              else container.children[i].children[1].innerText = test[fieldName][0];
            }
          }
        }
      }
    }
  });*/
  $("#selectedBox a").each(function () {
    let fieldName = $(this).attr("id");
    let rows = $(this).children("table").children("tbody").children("tr");
    for (let i = 0; i < rows.length; i++) {
      let lang = rows[i].children[0].textContent;
      let value = rows[i].children[1].textContent;
      if (typeof test[fieldName] != undefined && typeof test[fieldName][lang] != undefined) {
        if (value == "" || value.length == 0 || typeof value == undefined) {
          if (isLanguageDependent(fieldName)) rows[i].children[1].innerText = test[fieldName][lang];
          else rows[i].children[0].innerText = test[fieldName][0];
        }
      }
    }
  });
}

function metadataInitialized() {
  return initialized;
}

function initializeMetadata() {
  sessionStorage.setItem("bookDetails", JSON.stringify(bookDetails));
  createTable("Title", "selectedBox", "Title");
  createTable("Identifier", "selectedBox", "Identifier");
  updateAddedList(0, 1);
  initialized = true;
}

//handle adding items from available metadata cloumn to added metadata column
function addBtn() {
  let selectedOpts = $("#itemBox option:selected");
  if (selectedOpts.length == 0) {
    alert("Nothing to move.");
    return;
  }
  let itemValue = $("#itemBox option:selected").val();
  for (let i = 0; i < selectedOpts.length; i++) {
    createTable(selectedOpts[i].text, "selectedBox", itemValue);
    $(selectedOpts[i]).remove();
  }
}

//handle removing items from added metadata cloumn to available metadata column
function removeBtn() {
  let selectedOpts = $("#selectedBox .list-group-item.active");
  if (selectedOpts.length == 0) {
    alert("Nothing to move.");
    return;
  }
  let metadataText = $("#selectedBox .list-group-item.active>table>thead").text();
  let itemIntVal = $("#selectedBox .list-group-item.active").attr("id");
  let optionElem = document.createElement("option");
  optionElem.setAttribute("value", itemIntVal);
  if (accessMeta.includes(itemIntVal)) {
    optionElem.setAttribute("class", "bi bi-person-wheelchair");
    optionElem.setAttribute("data-tokens", metadataText);
  }
  if (reqMeta.includes(itemIntVal)) {
    alert("Required Metadata.");
    $("#selectedBox #" + metadataText).removeClass("active");
    return;
  }
  optionElem.appendChild(document.createTextNode(metadataText));
  $("#itemBox").append(optionElem);
  $("#selectedBox #" + itemIntVal).remove();
}

//create table for each metadata
//langChange is a flag indicates that the function called from publication languages on change so we can update metadata that depends on the language change
function createTable(tableTitle, elemID, itemVal, langChange) {
  let elementTitle = tableTitle.replace(/\s/g, "");
  let bookDetObj = parseBookData();
  // check if the table doesn't have values
  if (bookDetObj[tableTitle] == undefined) {
    createNewTable(tableTitle, elemID, itemVal);
    return;
  }
  // check if the table is already exisit for the table title
  if (checkAddedList(elementTitle) == 1 && (langChange || langChange != 1)) {
    return;
  }
  let tbl = document.createElement("table");
  tbl.setAttribute("class", "table table-sm table-bordered table-striped");
  tbl.setAttribute("contenteditable", "true");
  tableHeader(tbl, tableTitle, itemVal);
  let tbdy = document.createElement("tbody");
  if (langMetadata.includes(itemVal)) {
    langMetaAttr(tbl, tbdy, itemVal, elemID);
    return;
  }
  for (let val in bookDetObj[tableTitle]) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(val));
    th.setAttribute("scope", "row");
    th.setAttribute("class", "metaHeader");
    th.setAttribute("contenteditable", "false");
    tr.appendChild(th);
    let td = document.createElement("td");
    td.appendChild(document.createTextNode(bookDetObj[tableTitle][val]));
    if (!reqMeta.includes(itemVal)) {
      createIcon(td, "bi bi-trash3-fill", "delete entry");
    }
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  aElement(tbl, itemVal, elemID);
}

// Create selected languages rows in the tables
function langMetaAttr(tbl, tbdy, itIntVal, elemId) {
  let bookDetObj = parseBookData();
  let value = "";
  let langs = JSON.parse(sessionStorage.getItem("pubLang"));
  // in case nothing gets selected, set english as standard
  if (langs == undefined || langs == null) {
    langs = [];
    langs.push("EN");
  }
  for (let i = 0; i < langs.length; i++) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(langs[i]));
    th.setAttribute("scope", "row");
    th.setAttribute("class", "metaHeader");
    th.setAttribute("contenteditable", "false");
    tr.appendChild(th);
    let td = document.createElement("td");
    if (bookDetObj[itIntVal]) {
      value = bookDetObj[itIntVal][langs[i]];
    }
    if (value != "" && value != undefined && value != "undefined") {
      td.appendChild(document.createTextNode(value));
    } else {
      td.appendChild(document.createTextNode(""));
    }
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  aElement(tbl, itIntVal, elemId);
}

//create table header element
function tableHeader(tbl, tableTitle, aElemVal) {
  let thd = document.createElement("thead");
  let thdtr = document.createElement("tr");
  let thdth = document.createElement("th");
  thdth.setAttribute("scope", "col");
  thdth.setAttribute("colspan", "2");
  thdth.setAttribute("contenteditable", "false");
  if (reqMeta.includes(aElemVal)) {
    thdth.setAttribute("class", "required");
  }
  thdthText = document.createTextNode(tableTitle);
  thdth.appendChild(thdthText);
  if (!reqMeta.includes(aElemVal) && !langMetadata.includes(aElemVal)) {
    createIcon(thdth, "bi bi-plus-square-fill", "Add new entry", "");
  }
  thdtr.appendChild(thdth);
  thd.appendChild(thdtr);
  tbl.appendChild(thd);
}

//create anchor element to the added metadata column
function aElement(tbl, tableVal, elemID) {
  console.log("aElem");
  let metadata = document.getElementById(elemID);
  let aElem = document.createElement("a");
  aElem.setAttribute("class", "list-group-item list-group-item-action");
  //aElem.setAttribute("href", "#");
  aElem.setAttribute("id", tableVal);
  aElem.appendChild(tbl);
  metadata.append(aElem);
  events();
}

function events() {
  $("#selectedBox .list-group-item").on("click", function (e) {
    if ($("#selectedBox .list-group-item").hasClass("active")) {
      $("#selectedBox .list-group-item").removeClass("active");
    }
    $(e.target).addClass("active");
    document.getElementById("metadataInfo").innerHTML = infoObj[$(this).attr("id")];
  });

  $("#selectedBox i.bi-trash3-fill").on("click", function (e) {
    if ($(this)) {
      //delete an existing entry
      let title = $(this).closest("table").children("thead").text();
      let key = $(this).closest("tr").children()[0].innerText;
      updateBookData(title, key, "delete");
      $(this).closest("tr").html("");
    }
  });

  $("#selectedBox i.bi-plus-square-fill").on("click", function (e) {
    if ($(this)) {
      let title = $(this).closest("table").children("thead").text();
      // $("#selectedBox #PublishingDate tbody tr").length or we can check from the session value
      if (title == "Publishing Date" && $("#selectedBox #PublishingDate tbody tr").length == 1) {
        $(this).closest(".list-group-item").removeClass("active");
        alert("publications date MUST NOT contain more than one entry");
        return;
      } else {
        addNewRow(title);
      }
    }
  });
}

function createNewTable(tableTitle, elemID, intVal) {
  //create new table if the metadata doesn't have any data
  let tbl = document.createElement("table");
  tbl.setAttribute("class", "table table-sm table-bordered table-striped");
  tbl.setAttribute("contenteditable", "true");
  tableHeader(tbl, tableTitle, intVal);
  if (langMetadata.includes(intVal)) {
    let tbdy = document.createElement("tbody");
    langMetaAttr(tbl, tbdy, intVal, elemID);

    return;
  }
  aElement(tbl, intVal, elemID);
}

function addNewRow(tableTitle) {
  let elementTitle = tableTitle.replace(/\s/g, "");
  var relTable = $("#selectedBox #" + elementTitle + " table");
  let count = 0;
  let tbdy = document.createElement("tbody");
  if (!langMetadata.includes(elementTitle)) {
    count = $("#selectedBox #" + elementTitle + " tbody tr").length + 1;
  }
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.appendChild(document.createTextNode(count));
  th.setAttribute("scope", "row");
  th.setAttribute("class", "metaHeader");
  th.setAttribute("contenteditable", "false");
  tr.appendChild(th);
  let td = document.createElement("td");
  tr.appendChild(td);
  tbdy.appendChild(tr);
  relTable.append(tbdy);
}

function parseBookData() {
  let bookDetObj = JSON.parse(sessionStorage.getItem("bookDetails"));
  return bookDetObj;
}

function updateBookData(title, key, mode, val) {
  let bookDetObj = JSON.parse(sessionStorage.getItem("bookDetails"));
  if (mode == "delete") {
    delete bookDetObj[title][key];
  } else {
    if (bookDetObj[title] == undefined) {
      bookDetObj[title] = {};
    }
    bookDetObj[title][key] = val;
  }
  sessionStorage.setItem("bookDetails", JSON.stringify(bookDetObj));
  updateAddedList(0, 0);
}

// update the list to get the updated values
// langChange is a flag indicates that the function called from publication languages on change so we can update metadata that depends on the language change
// multipleUp is a flag indicates that the function called from metadata tab onclick so title and identifier elements are updated already
function updateAddedList(langChange, multipleUp) {
  $("#selectedBox .table").each(function () {
    if ($(this)) {
      let currtitle = $(this).children("thead").text();
      if (multipleUp == 1 && (currtitle == "Title" || currtitle == "Identifier")) {
        return;
      }
      let elementId = $(this).closest("a").attr("id");
      $("#" + elementId).remove();
      //iIntVal = $("#selectedBox .list-group-item.active").attr("id");
      createTable(currtitle, "selectedBox", elementId, langChange);
    }
  });
}

//check if the metadata is already in the added list box
function checkAddedList(title) {
  return $("#selectedBox #" + title).length;
}

//Update info panel value
function updateInfo() {
  let selectedOpts = $("#itemBox option:selected");
  if (selectedOpts.length == 0) {
    return;
  }
  document.getElementById("metadataInfo").innerHTML = infoObj[selectedOpts.val()];
}
