//accessibility metadata options
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

const fieldIntMap = {
  Author: 'Creator',
  AccessMode: 'Mode',
  AccessModeSufficient: 'Mode Sufficient',
  AccessibilityFeature: 'Feature',
  AccessibilityHazard: 'Hazard',
  AccessibilitySummary: 'Summary',
};

let bookDetails = {
  Title: {/*
    EN: "Hello whats up, this is my incredibly cool book :)",
    IT: "Cappuccetto Rosso",*/
  },
  Identifier: {/*
    EN: "978-0-5490-2195-4",
    IT: "978-0-5490-2196-4",*/
  },
  SourceISBN: "",
  Description: {},
  Author: {/*
    1: "Vincentas Élisabeth",
    2: "Agata Lia",*/
  },
  Contributor: {/*
    1: "Viviano Pierpaolo",
    2: "Maëlie Celestine",
    3: "Vincentas Élisabeth",
    4: "Agata Lia",*/
  },
  Publisher: {},
  Copyright: "",
  AccessMode: {},
  AccessModeSufficient: {},
  AccessibilityFeature: {},
  AccessibilityHazard: {},
  AccessibilitySummary: {},
  CertifiedBy: {},
  ConformsTo: {/*
    1: "Viviano Pierpaolo",
    2: "Maëlie Celestine",*/
  },
  PublishingDate: {},
};

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

function initializeMetadata() {
  sessionStorage.setItem("bookDetails", JSON.stringify(bookDetails));
  createTable("Title", "selectedBox", "Title");
  createTable("Identifier", "selectedBox", "Identifier");
  displayMetadataContent()
  updateAddedList(0, 1);
}

function displayMetadataContent(){
  let bookDetObj = parseSessionData("bookDetails");
  for (let val in bookDetObj) {
    if (Object.keys(bookDetObj[val]).length == 0 || checkAddedList(val) > 0) {
      continue;
    }
    let DispValue = val;
    if (fieldIntMap.hasOwnProperty(val)) DispValue= fieldIntMap[DispValue];
    if (!bookDetObj.hasOwnProperty(val)){
      bookDetObj[val]={}
    }
    createTable(DispValue, "selectedBox", val);
    $("#itemBox option[value='"+val+"'").remove();
  }
}

//handle adding items from available metadata cloumn to added metadata column
function addBtn() {
  let selectedOpts = $("#itemBox option:selected");
  if (selectedOpts.length == 0) {
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
  let selectedOpts = $("#selectedBox input:checked");
  if (selectedOpts.length == 0) {
    return;
  }
  //loop through the checked added metadata list to remove them
  for (let i = 0; i < selectedOpts.length; i++) {
    let itemIntVal = selectedOpts[i].name;
    let metadataText = $("#selectedBox #"+itemIntVal+'>table>thead').text();
    let optionElem = document.createElement("option");
    optionElem.setAttribute("value", itemIntVal);
    if (accessMeta.includes(itemIntVal)) {
     optionElem.setAttribute("class", "bi bi-person-wheelchair");
      optionElem.setAttribute("data-tokens", metadataText);
    }
    optionElem.appendChild(document.createTextNode(metadataText));
    $("#itemBox").append(optionElem);
    $("#selectedBox #" + itemIntVal).remove();
  }
  
}

//create table for each metadata
//langChange is a flag indicates that the function called from publication languages on change so we can update metadata that depends on the language change
function createTable(tableTitle, elemID, itemVal, langChange) {
  let bookDetObj = parseSessionData("bookDetails");
  // check if the table is not exist and doesn't have values
  if (checkAddedList(itemVal) != 1 && Object.keys(bookDetObj[itemVal]).length == 0) {
    createNewTable(tableTitle, elemID, itemVal);
    return;
  }
  // check if the table is already exisit for the table title
  if (checkAddedList(itemVal) == 1 && (langChange || langChange != 1)) {
    return;
  }
  let tbl = document.createElement("table");
  tbl.setAttribute("class", "table table-sm table-bordered table-striped");
  tableHeader(tbl, tableTitle, itemVal);
  let tbdy = document.createElement("tbody");
  if (langMetadata.includes(itemVal)) {
    langMetaAttr(tbl, tbdy, itemVal, elemID);
    return;
  }
  for (let val in bookDetObj[itemVal]) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(val));
    th.setAttribute("scope", "row");
    th.setAttribute("class", "metaHeader");
    tr.appendChild(th);
    let td = document.createElement("td");
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "form-control");
    input.value = bookDetObj[itemVal][val];
    if (!reqMeta.includes(itemVal)) {
      createIcon(td, "bi bi-trash3-fill", "delete entry");
    }
    td.appendChild(input);
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  liElement(tbl, itemVal, elemID);
}

// Create selected languages rows in the tables
function langMetaAttr(tbl, tbdy, itIntVal, elemId) {
  let bookDetObj = parseSessionData("bookDetails");
  let value = "";
  let langs = parseSessionData("pubLang");
  for (let i = 0; i < langs.length; i++) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(langs[i]));
    th.setAttribute("scope", "row");
    th.setAttribute("class", "metaHeader");
    tr.appendChild(th);
    let td = document.createElement("td");
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "form-control");
    if (bookDetObj[itIntVal]) {
      value = bookDetObj[itIntVal][langs[i]];
    }
    if (value != "" && value != undefined && value != "undefined") {
      input.value = value;
    } else {
      input.value = "";
    }
    td.appendChild(input);
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  liElement(tbl, itIntVal, elemId);
}

//create table header element
function tableHeader(tbl, tableTitle, aElemVal) {
  let thd = document.createElement("thead");
  let thdtr = document.createElement("tr");
  let thdth = document.createElement("th");
  thdth.setAttribute("scope", "col");
  thdth.setAttribute("colspan", "2");
  if (reqMeta.includes(aElemVal)) {
    thdth.setAttribute("class", "required");
  }
  thdthText = document.createTextNode(tableTitle);
  thdth.appendChild(thdthText);
  if (!reqMeta.includes(aElemVal) && !langMetadata.includes(aElemVal)) {
    if (aElemVal == "PublishingDate") {
      // check if the property is there
      if (Object.keys(getSessionElem("bookDetails","PublishingDate")).length < 1) {
        createIcon(thdth, "bi bi-plus-square-fill", "Add new entry", "");
      }
    } else {
      createIcon(thdth, "bi bi-plus-square-fill", "Add new entry", "");
    }
  }
  thdtr.appendChild(thdth);
  thd.appendChild(thdtr);
  tbl.appendChild(thd);
}

//create anchor element to the added metadata column
function liElement(tbl, tableVal, elemID) {
  let metadata = document.getElementById(elemID);
  let liElement = document.createElement("li");
  liElement.setAttribute("class", "list-group-item list-group-item-action");
  liElement.setAttribute("id", tableVal);
  if (!reqMeta.includes(tableVal)) {
    let liInput = document.createElement("input");
    liInput.setAttribute("type", "checkbox");
    liInput.setAttribute("name", tableVal);
    liInput.setAttribute("aria-label", "select "+ tbl.children[0].textContent +' item');
    liElement.appendChild(liInput);
  }
  liElement.appendChild(tbl);
  metadata.append(liElement);
}

// handle on click for the added metadata list elements
$(document).on("click", "#selectedBox .list-group-item", function (e) {
  document.getElementById("metadataInfo").innerHTML = infoObj[e.currentTarget.id];
});

// handle on click for the trash icon
$(document).on("click", "#selectedBox i.bi-trash3-fill", function (e) {
  if ($(this)) {
    //delete an existing entry
    let titleId = $(this).closest("li").attr("id");
    let key = $(this).closest("tr").children()[0].innerText;
    updateBookData(titleId, key, "delete");
    $(this).closest("tr").html("");
  }
});

// Add new row to the table for the new elements
$(document).on("click", "#selectedBox i.bi-plus-square-fill", function (e) {
  if ($(this)) {
    let title = $(this).closest("li").attr("id");
    addNewRow(title);
  }
});

// save the values when the input element loses the focus
$(document).on("focusout", "#selectedBox input[type='text']", function (e) {
  if ($(this)) {
    let internalValue = $(this).closest("li").attr("id");
    let key = $(this).closest("tr").children("th").text();
    let val = $(this).val();
    updateBookData(internalValue, key, "update", val);
  }
});

// handel enter key press when tabbing to the checkbox input
$(document).on("keypress", "#selectedBox li input[type='checkbox']", function (e) {
  if (e.which === 13) {
    //for enter key
    this.checked = !this.checked;
  }
});

function createNewTable(tableTitle, elemID, intVal) {
  //create new table if the metadata doesn't have any data
  let tbl = document.createElement("table");
  tbl.setAttribute("class", "table table-sm table-bordered table-striped");
  tableHeader(tbl, tableTitle, intVal);
  if (langMetadata.includes(intVal)) {
    let tbdy = document.createElement("tbody");
    langMetaAttr(tbl, tbdy, intVal, elemID);
    return;
  }
  liElement(tbl, intVal, elemID);
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
  if (elementTitle == "PublishingDate" && $("#selectedBox #PublishingDate tbody tr").length < 1) {
    $("#selectedBox #" + elementTitle + " thead tr th i").remove();
  }
  tr.appendChild(th);
  let td = document.createElement("td");
  let input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("class", "form-control");
  input.value = "";
  td.appendChild(input);
  tr.appendChild(td);
  tbdy.appendChild(tr);
  relTable.append(tbdy);
}
function updateBookData(tableItemVal, key, mode, val) {
  let bookDetObj = parseSessionData("bookDetails");
  if (mode == "delete") {
    delete bookDetObj[tableItemVal][key];
  } else {
    if (Object.keys(bookDetObj[tableItemVal]).length == 0) {
      bookDetObj[tableItemVal] = {};
    }
    bookDetObj[tableItemVal][key] = val;
  }
  sessionStorage.setItem("bookDetails", JSON.stringify(bookDetObj));
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
      let elementId = $(this).closest("li").attr("id");
      $("#" + elementId).remove();
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
