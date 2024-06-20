//accessibility metadata options
const accessMeta = ["AccessMode", "AccessibilityFeature", "AccessibilityHazard", "AccessibilitySummary", "AccessModeSufficient", "ConformsTo", "CertifiedBy"];
//required metadata
const reqMeta = ["Title", "Identifier"];
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
  PublishingDate: 'Publishing Date',
  AccessMode: 'Mode',
  AccessModeSufficient: 'Mode Sufficient',
  AccessibilityFeature: 'Feature',
  AccessibilityHazard: 'Hazard',
  AccessibilitySummary: 'Summary',
};

let bookDetails = {
  Title: {},
  Identifier: {},
  SourceISBN: "",
  Description: {},
  Author: {},
  Contributor: {},
  Publisher: {},
  Copyright: "",
  AccessMode: {},
  AccessModeSufficient: {},
  AccessibilityFeature: {},
  AccessibilityHazard: {},
  AccessibilitySummary: {},
  CertifiedBy: {},
  ConformsTo: {},
  PublishingDate: {},
};

let infoObj = {};

function setInfoObj(infoText){
//info panel content object
  return {
    Title:
      "Represents an instance of a name for the EPUB publication. <a class='langTxt' target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-title'>" + infoText + "</a>",
    Identifier:
      "Contains an identifier such as UUID, DOI or ISBN. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-identifier'>" + infoText + "</a>",
    Contributor:
      "Represent the name of a person, organisation, etc. that played a secondary role in the creation of the content. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-contributor'>" +
    infoText +
      "</a>",
    Author:
      "Represents the name of a person/organisation, responsible for the creation of the content. (Authors, Illustrators, etc..). <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-creator'>" +
      infoText +
      "</a>",
    Publisher:
      "Refers to a publishing company or organisation, or to an individual who leads a publishing company. <a class='langTxt' target='_blank' href='https://www.w3.org/TR/epub-33/#sec-opf-dcmes-optional-def'>" +
      infoText +
      "</a>",
    PublishingDate:
      "Defines the publication date of the EPUB. The publication date is not the same as the last modified date. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-date'>" +
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
      "A human sensory perceptual system or cognitive faculty necessary to process or perceive the content (e.g. textual, visual, auditory, tactile). <a target='_blank' href='https://schema.org/accessMode'>" +
      infoText +
      "</a>",
    AccessibilityFeature:
      "Features and adaptations that contribute to the overall accessibility of the content (e.g. alternative text, extended descriptions, captions). <a target='_blank' href='https://schema.org/accessibilityFeature'>" +
      infoText +
      "</a>",
    AccessibilityHazard:
      "Any potential hazards that the content presents (e.g. flashing, motion simulation, sound). <a target='_blank' href='https://schema.org/accessibilityHazard'>" +
      infoText +
      "</a>",
    AccessibilitySummary:
      "A human-readable summary of accessibility that complements, but does not duplicate the other discoverabilty metadata. It also describes any know deficiencies (e.g. lack of extended descriptions, specific hazards). <a target='_blank' href='https://schema.org/accessibilitySummary'>" +
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
}

// initialize metadata screen data
function initializeMetadata() {
  if (sessionStorage.getItem("translation") != undefined){
    moreTxt = translateTxt("More");
    infoObj = setInfoObj(moreTxt);
  }
  if (sessionStorage.getItem("bookDetails") == null || sessionStorage.getItem("bookDetails") == undefined ){
    sessionStorage.setItem("bookDetails", JSON.stringify(bookDetails));
  }
  createTable(translateTxt("Title"), "selectedBox", "Title");
  createTable(translateTxt("Identifier"), "selectedBox", "Identifier");
  displayMetadataContent()
  updateAddedList(0, 1);
}

// create table for the exist metadata in the session variable
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
    reqAccessMeta(val)
    $("#itemBox option[value='"+val+"'").remove();
  }
}

//handle adding items from available metadata cloumn to added metadata column
function addBtn() {
  let selectedOpts = $("#itemBox option:selected");
  if (selectedOpts.length == 0) {
    return;
  }
  for (let i = 0; i < selectedOpts.length; i++) {
    createTable(selectedOpts[i].text, "selectedBox", selectedOpts[i].value);
    reqAccessMeta(selectedOpts[i].value)
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
    optionElem.setAttribute("class", "langTxt");
    if (accessMeta.includes(itemIntVal)) {
      optionElem.setAttribute("class", "bi bi-universal-access-circle langTxt");
      optionElem.setAttribute("data-tokens", metadataText);
    }
    optionElem.appendChild(document.createTextNode(metadataText));
    $("#itemBox").append(optionElem);
    $("#selectedBox #" + itemIntVal).remove();
    // commented to check if they request it 
    //checkSelectedAccess(itemIntVal);
  }
  
}

//create table for each metadata
//langChange is a flag indicates that the function called from publication languages on change so we can update metadata that depends on the language change
function createTable(tableTitle, elemID, itemVal, langChange) {
  let bookDetObj = parseSessionData("bookDetails");
  if (bookDetObj == null){
    initializeMetadata();
  } 
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
      createIcon(td, "bi bi-trash3-fill", translateTxt("delete entry"));
    }else{
      input.required = true;
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
  if (langs.length == 0) return;
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
    if (reqMeta.includes(itIntVal)) {
      input.required = true;
    }
    let currLang = document.getElementById("appLang").value;
    if (itIntVal == 'Title' && bookDetObj[itIntVal].hasOwnProperty(currLang) && bookDetObj[itIntVal][currLang] != undefined){
      $("#pubFileName").val(input.value.replace(/ /g,"_"));
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
  thdth.setAttribute("class", "langTxt");
  if (reqMeta.includes(aElemVal)) {
    thdth.setAttribute("class", "required langTxt");
  }
  thdthText = document.createTextNode(tableTitle);
  thdth.appendChild(thdthText);
  if (!reqMeta.includes(aElemVal) && !langMetadata.includes(aElemVal)) {
    if (aElemVal == "PublishingDate") {
      // check if the property is there
      if (Object.keys(getSessionElem("bookDetails","PublishingDate")).length < 1) {
        createIcon(thdth, "bi bi-plus-square-fill", translateTxt("Add new entry"), "");
      }
    } else {
      createIcon(thdth, "bi bi-plus-square-fill", translateTxt("Add new entry"), "");
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
    liInput.setAttribute("aria-label", translateTxt("select")+' '+ tbl.children[0].textContent +' '+ translateTxt('item'));
    liElement.appendChild(liInput);
  }
  liElement.appendChild(tbl);
  metadata.append(liElement);
}

// handle on click for the added metadata list elements
$(document).on("click", "#selectedBox .list-group-item", function (e) {
  if (sessionStorage.getItem("translation") != undefined){
    moreTxt = translateTxt("More");
    infoObj = setInfoObj(moreTxt);
  }
  document.getElementById("metadataInfo").innerHTML = translateTxt(infoObj[e.currentTarget.id]);
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

// handel enter key press when tabbing to the plus icon
$(document).on("keypress", "#selectedBox .bi-plus-square-fill", function (e) {
  if (e.which === 13) {
    //for enter key
    this.click();
  }
});

//create new table if the metadata doesn't have any data
function createNewTable(tableTitle, elemID, intVal) {
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

// add new row to the table when the user press plus icon
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
  if (!reqMeta.includes(elementTitle)) {
    createIcon(td, "bi bi-trash3-fill", translateTxt("delete entry"));
  }else{
    input.required = true;
  }
  td.appendChild(input);
  tr.appendChild(td);
  tbdy.appendChild(tr);
  relTable.append(tbdy);
}

// update book data details
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
  let currLang = document.getElementById("appLang").value;
  // set the publishing file name if we the title of the book has been updated
  if (tableItemVal == 'Title' && bookDetObj[tableItemVal].hasOwnProperty(currLang) && bookDetObj[tableItemVal][currLang] != undefined){
    $("#pubFileName").val(val.replace(/ /g,"_"));
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
      createTable(translateTxt(currtitle), "selectedBox", elementId, langChange);
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
  if (sessionStorage.getItem("translation") != undefined){
    moreTxt = translateTxt("More");
    infoObj = setInfoObj(moreTxt);
  }
  document.getElementById("metadataInfo").innerHTML = translateTxt(infoObj[selectedOpts.val()]);
}

  // add access summary and access mode sufficient to the required  and added meta list if they are not exist
  // when the user add any accessibility metadata
function reqAccessMeta(itemVal){
  if (accessMeta.includes(itemVal)) {
    if(reqMeta.indexOf("AccessibilitySummary") === -1) reqMeta.push("AccessibilitySummary")
    if(reqMeta.indexOf("AccessModeSufficient") === -1) reqMeta.push("AccessModeSufficient")
    if (checkAddedList("AccessibilitySummary") < 1) createTable("Summary", "selectedBox", "AccessibilitySummary");
    if (checkAddedList("AccessModeSufficient") < 1) createTable("Mode Sufficient", "selectedBox", "AccessModeSufficient");
  }
}

// check if any accessibility metadata exist if not will enable all metadata fields to the user to remove
function checkSelectedAccess(itemVal){
  let accessExist = 0;
  if (accessMeta.includes(itemVal)) {
    for (let i = 0; i < accessMeta.length; i++) {
      if (checkAddedList(accessMeta[i]) > 0){
        accessExist = 1;
        return accessExist;
      }else{
        enableReqAccess("AccessibilitySummary");
        enableReqAccess("AccessModeSufficient");
      }
    }
  }
  return accessExist;
}

// remove item from the given array
function removeArrayItem(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

// add checkbox to the element, remove it from required array and remove required attributes 
function enableReqAccess(Item){
  removeArrayItem(reqMeta, Item);
  $("#selectedBox #"+Item+">table>tbody>tr>td>input").removeAttr('required');
  $("#selectedBox #"+Item+">table>thead>tr>th").removeClass('required');
  let liInput = document.createElement("input");
  liInput.setAttribute("type", "checkbox");
  liInput.setAttribute("name", Item);
  liInput.setAttribute("aria-label", translateTxt('select')+' '+ Item +' '+translateTxt('item'));
  $("#selectedBox #"+ Item).append(liInput);
}