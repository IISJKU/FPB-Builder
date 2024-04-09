//accessibility metadata options
const accessMeta = ['Mode', 'Feature', 'Hazard', 'Summary', 'Mode Sufficient', 'Conforms to', 'Certified by'];
//required metadata
const reqMeta = ['Title', 'Identifier', 'Summary', 'Mode Sufficient'];
const langMetadata = ['Title', 'Identifier', 'Mode', 'Feature', 'Hazard', 'Summary', 'Mode Sufficient', 'Type', 'Subject'];
let bookDetails={
  'Title': {
    'EN': "Little Red Riding Hood",
    'IT': "Cappuccetto Rosso",
  },
  'Identifier': {
    'EN': "978-0-5490-2195-4",
    'IT': "978-0-5490-2196-4",
  },
  'Contributor': {
    1: "Viviano Pierpaolo",
    2: "Maëlie Celestine",
    3: "Vincentas Élisabeth",
    4: "Agata Lia",
  },
};
let infoText ='More';
//info panel content object
let infoObj={
  'title': "Represents an instance of a name for the EPUB publication. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-title'>" + infoText + "</a>",
  'identifier': "Contains an identifier such as a UUID, DOI or ISBN. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-identifier'>" + infoText + "</a>",
  'contributor': "Represent the name of a person, organization, etc. that played a secondary role in the creation of the content. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-contributor'>" + infoText + "</a>",
  'creator': "Represents the name of a person, organization, etc. responsible for the creation of the content. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-creator'>" + infoText + "</a>",
  'publisher': "Refer to a publishing company or organization, or to an individual who leads a publishing company. <a target='_blank' href='https://www.w3.org/TR/epub-33/#sec-opf-dcmes-optional-def'>" + infoText + "</a>",
  'publishingdate': "Defines the publication date of the EPUB publication. The publication date is not the same as the last modified date. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-date'>" + infoText + "</a>",
  'subject': "Identifies the subject of the EPUB publication. The value should be human-readable heading or label, but a code value may used if the subject taxonomy does not provide a separate descriptive label. <a target='_blank' href='https://www.w3.org/TR/epub-33/#sec-opf-dcsubject'>" + infoText + "</a>",
  'type': "Used to indicate that the EPUB publication is of a specialized type (e.g., annotations or a dictionary packaged in EPUB format). <a target='_blank' href='https://www.w3.org/TR/epub-33/#sec-opf-dctype'>" + infoText + "</a>",
  'mode': "A human sensory perceptual system or cognitive faculty necessary to process or perceive the content (e.g., textual, visual, auditory, tactile). <a target='_blank' href='https://schema.org/accessMode'>" + infoText + "</a>",
  'feature': "Features and adaptations that contribute to the overall accessibility of the content (e.g., alternative text, extended descriptions, captions). <a target='_blank' href='https://schema.org/accessibilityFeature'>" + infoText + "</a>",
  'hazard': "Any potential hazards that the content presents (e.g., flashing, motion simulation, sound). <a target='_blank' href='https://schema.org/accessibilityHazard'>" + infoText + "</a>",
  'summary': "A human-readable summary of the accessibility that complements, but does not duplicate, the other discoverability metadata. It also describes any known deficiencies (e.g., lack of extended descriptions, specific hazards). <a target='_blank' href='https://schema.org/accessibilitySummary'>" + infoText + "</a>",
  'modesufficient': "A set of one or more access modes sufficient to consume the content without significant loss of information. The publication can have more than one set of sufficient access modes for its consumption depending on the types of content it includes. <a target='_blank' href='https://schema.org/accessModeSufficient'>" + infoText + "</a>",
  'conformsto': "Identify the accessibility requirements or guidelines the publication follows. <a target='_blank' href='https://www.dublincore.org/specifications/dublin-core/dcmi-terms/terms/conformsTo/'>" + infoText + "</a>",
  'certifiedby': "Identifies a party responsible for the testing and certification of the accessibility of an EPUB publication. <a target='_blank' href='https://www.w3.org/TR/epub-a11y-11/#certifiedBy'>" + infoText + "</a>",
};

//check if the details is already setted in the global object
if (!sessionStorage.getItem("bookDetails")){
  sessionStorage.setItem("bookDetails", (JSON.stringify(bookDetails)));
}

//handle adding items from available metadata cloumn to added metadata column
function addBtn(){
  let selectedOpts = $('#itemBox option:selected');
  if (selectedOpts.length == 0) {
    alert("Nothing to move.");
    return;
  }
  for (let i = 0; i < selectedOpts.length; i++) {
    createTable(selectedOpts[i].text,"selectedBox");
    $(selectedOpts[i]).remove();
  }
}

//handle removing items from added metadata cloumn to available metadata column
function removeBtn(){ 
  let selectedOpts = $('#selectedBox .list-group-item.active');
  if (selectedOpts.length == 0) {
      alert("Nothing to move.");
      return;
  }
  let metadataText = $("#selectedBox .list-group-item.active>table>thead").text();
  let itemText= metadataText.replace(/\s/g,'');
  let optionElem = document.createElement('option');
  optionElem.setAttribute('value', itemText.toLowerCase());
  if (accessMeta.includes(metadataText)){
    optionElem.setAttribute('class', 'bi bi-person-wheelchair');
    optionElem.setAttribute('data-tokens', metadataText);
  }
  if (reqMeta.includes(metadataText)){
    alert("Required Metadata.");
    $("#selectedBox #"+ metadataText).removeClass('active');
    return;
  }
  optionElem.appendChild(document.createTextNode(metadataText));
  $('#itemBox').append(optionElem);
  $("#selectedBox #"+ itemText).remove();
}

//create table for each metadata 
//langChange is a flag indicates that the function called from publication languages on change so we can update metadata that depends on the language change
function createTable(tableTitle, elemID, langChange){
  let elementTitle=tableTitle.replace(/\s/g,'');
  let bookDetObj = parseBookData()
  // check if the table doesn't have values
  if (bookDetObj[tableTitle] == undefined) {
    createNewTable(tableTitle, elemID);
    return;
  }
  // check if the table is already exisit for the table title
  if (checkAddedList(elementTitle) == 1 && (langChange || langChange!= 1 )){
    return;
  }
  let tbl = document.createElement('table');
  tbl.setAttribute('class', 'table table-sm table-bordered table-striped');
  tbl.setAttribute('contenteditable', 'true');
  tableHeader(tbl, tableTitle)
  let tbdy = document.createElement('tbody');
  if (langMetadata.includes(tableTitle)){
    langMetaAttr(tbl, tbdy, tableTitle, elemID)
    return;
  }
  for(let val in bookDetObj[tableTitle]) {
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    th.appendChild(document.createTextNode(val));
    th.setAttribute('scope','row');
    th.setAttribute('contenteditable','false');
    tr.appendChild(th);
    let td = document.createElement('td');
    td.appendChild(document.createTextNode(bookDetObj[tableTitle][val]));
    if (!reqMeta.includes(tableTitle)){
      createIcon(td, 'bi bi-trash3-fill','delete entry')
    }
    //createIcon(td, 'bi bi-pencil-square','edit entry','', '#editMetaModal')
    tr.appendChild(td)
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  aElement(tbl, tableTitle, elemID)
}

// Create selected languages rows in the tables
function langMetaAttr(tbl, tbdy, title, elemId){
  let bookDetObj = parseBookData()
  let value = '';
  let langs = JSON.parse(sessionStorage.getItem("pubLang"));
  for (let i = 0; i < langs.length; i++) {
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    th.appendChild(document.createTextNode(langs[i]));
    th.setAttribute('scope','row');
    th.setAttribute('class','langMetaHeader');
    th.setAttribute('contenteditable','false');
    tr.appendChild(th);
    let td = document.createElement('td');
    if (bookDetObj[title]){
      value = bookDetObj[title][langs[i]];
    }
    if (value != '' && value != undefined && value != 'undefined'){
      td.appendChild(document.createTextNode(value));
    }else{
      td.appendChild(document.createTextNode(''));
    }
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  aElement(tbl, title, elemId)
}

//create table header element
function tableHeader(tbl, tableTitle){
  let thd = document.createElement('thead');
  let thdtr = document.createElement('tr');
  let thdth = document.createElement('th');
  thdth.setAttribute('scope','col');
  thdth.setAttribute('colspan','2');
  thdth.setAttribute('contenteditable','false');
  if (reqMeta.includes(tableTitle)){
    thdth.setAttribute('class','required');
  }
  thdthText= document.createTextNode(tableTitle);
  thdth.appendChild(thdthText);
  if (!reqMeta.includes(tableTitle)){
    createIcon(thdth, 'bi bi-plus-square-fill','Add new entry','', '#addMetaModal')
  }
  thdtr.appendChild(thdth);
  thd.appendChild(thdtr);
  tbl.appendChild(thd);
}

//create anchor element to the added metadata column
function aElement(tbl, tableTitle, elemID){
  let metadata = document.getElementById(elemID)
  let aElem = document.createElement('a');
  aElem.setAttribute('class', 'list-group-item list-group-item-action');
  aElem.setAttribute('href', '#');
  let elementTitle=tableTitle.replace(/\s/g,'');
  aElem.setAttribute('id', elementTitle);
  aElem.appendChild(tbl);
  metadata.append(aElem);
  events();
}

function events(){
  $("#selectedBox .list-group-item").on("click", function(e) {
    if($("#selectedBox .list-group-item").hasClass("active")){
      $("#selectedBox .list-group-item").removeClass("active");
    }
    $(e.target).addClass("active");
    document.getElementById("metadataInfo").innerHTML = infoObj[$(this).attr('id').toLowerCase()]
  });

  $("#selectedBox i.bi-trash3-fill").on("click", function(e) {
  if($(this)){
    //delete an existing entry
    let title = $(this).closest('table').children('thead').text();
    let key = $(this).closest('tr').children()[0].innerText;
    updateBookData(title, key, 'delete')
    $(this).closest('tr').html('');
  }
  });

  $("#selectedBox i.bi-pencil-square").on("click", function(e) {
    if($(this)){
      //show the modal to add the new entry
      let title = $(this).closest('table').children('thead').text();
      let key = $(this).closest('tr').children()[0].innerText;
      let val = $(this).closest('td').text();
      let modalID = $(this).attr('data-bs-target');
      setModalValues(modalID, title, key, val)
    }
  });

  $("#selectedBox i.bi-plus-square-fill").on("click", function(e) {
    if($(this)){
      let title = $(this).closest('table').children('thead').text();
      if (title =='Publishing date' && $("#selectedBox #Publishingdate").length ==1){
        alert('publications date MUST NOT contain more than one entry');
        $(this).removeClass("active");
        return;
      }
      let modalID = $(this).attr('data-bs-target');
      setModalValues(modalID, title, '', '','add');
      //check if the fade div is already exist
      if ($("#modal-fade").length == 0){
        // create div to appy the fading when the modal opens
        let elemDiv = document.createElement('div');
        elemDiv.setAttribute('class', 'modal-backdrop fade show');
        elemDiv.setAttribute('id', 'modal-fade');
        document.body.appendChild(elemDiv);
      }
    }
  });
}

function createNewTable(tableTitle, elemID){
  //create new table if the metadata doesn't have any data
  let tbl = document.createElement('table');
  tbl.setAttribute('class', 'table table-sm table-bordered table-striped');
  tbl.setAttribute('contenteditable', 'true');
  tableHeader(tbl, tableTitle)
  if (langMetadata.includes(tableTitle)){
    let tbdy = document.createElement('tbody');
    langMetaAttr(tbl, tbdy, tableTitle, elemID);
    return;
  }
  aElement(tbl, tableTitle, elemID)
}

function setModalValues(modalID, tableTitle, header, val, mode){
  //set the values to the modal and show it
  let body='';
  let bodyLabel='';
  if (mode == 'add'){
    bodyLabel = 'addMetaBodyLabel';
    body = 'addMetaBody';
  } else {
    bodyLabel = 'editMetaBodyLabel';
    body = 'editMetaBody';
  }
  $(modalID+'Label').text(tableTitle);
  $(modalID+' #'+bodyLabel).val(header);
  $(modalID+' #'+ body).val(val);
  $(modalID).show();
}

function updateValue(){
  //Update values in the table
  let title = $('#editMetaModalLabel').text();
  let key = $('#editMetaBodyLabel').val();
  let val = $('#editMetaBody').val();
  updateBookData(title, key, 'update', val);
  closeModal('editMetaModal')
  //window.location.reload();
}

function addValue(){
  //Add the values to the table
  let title = $('#addMetaModalLabel').text();
  let key = $('#addMetaBodyLabel').val();
  let val = $('#addMetaBody').val();
  updateBookData(title, key, 'add', val);
  closeModal('addMetaModal')
}

// hide modal
function closeModal(modalID){
  // check if the fade div is exist
  let fadeDiv = document.getElementById("modal-fade");
  if (fadeDiv != null){
    document.body.removeChild(fadeDiv);
  }
  $('#'+modalID).hide();
}

function parseBookData(){
  let bookDetObj = JSON.parse(sessionStorage.getItem('bookDetails'))
  return bookDetObj
}

function updateBookData(title, key, mode, val){
  let bookDetObj = JSON.parse(sessionStorage.getItem('bookDetails'))
  if (mode == 'delete'){
    delete bookDetObj[title][key];
  } else {
    if (bookDetObj[title] == undefined) {
      bookDetObj[title] = {}
    }
    bookDetObj[title][key] = val;
  }
  sessionStorage.setItem("bookDetails", (JSON.stringify(bookDetObj)));
  updateAddedList(0, 0);
}

// update the list to get the updated values
// langChange is a flag indicates that the function called from publication languages on change so we can update metadata that depends on the language change
// multipleUp is a flag indicates that the function called from metadata tab onclick so title and identifier elements are updated already 
function updateAddedList(langChange, multipleUp){
  $("#selectedBox .table").each(function(){
    if ($(this)){
      let currtitle = $(this).children('thead').text();
      if (multipleUp == 1 && (currtitle== 'Title' || currtitle== 'Identifier')){
        return;
      }
      let elementTitle=currtitle.replace(/\s/g,'');
      $('#'+elementTitle).remove();
      createTable(currtitle,"selectedBox", langChange);
    }
  });
}

//check if the metadata is already in the added list box
function checkAddedList(title){
  return $("#selectedBox #"+title).length
}

//Update info panel value
function updateInfo(){
  let selectedOpts = $('#itemBox option:selected');
  if (selectedOpts.length == 0) {
    return;
  }
  document.getElementById("metadataInfo").innerHTML = infoObj[selectedOpts.val()]
}