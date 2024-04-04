//accessibility metadata options
const accessMeta = ['Mode','Feature','Hazard','Summary','Mode Sufficient','Conforms to','Certified by'];
//required metadata
const reqMeta = ['Title','Identifier'];
var bookDetails={
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
var infoText ='More';
//info panel content object
var infoObj={
  'title': "Represents an instance of a name for the EPUB publication. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-title'>" + infoText + "</a>",
  'identifier': "Contains an identifier such as a UUID, DOI or ISBN. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-identifier'>" + infoText + "</a>",
  'contributor': "Represent the name of a person, organization, etc. that played a secondary role in the creation of the content. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-contributor'>" + infoText + "</a>",
  'creator': "Represents the name of a person, organization, etc. responsible for the creation of the content. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-creator'>" + infoText + "</a>",
  'publisher': "Refer to a publishing company or organization, or to an individual who leads a publishing company. <a target='_blank' href='https://www.w3.org/TR/epub-33/#sec-opf-dcmes-optional-def'>" + infoText + "</a>",
  'publishingdate': "Defines the publication date of the EPUB publication. The publication date is not the same as the last modified date. <a target='_blank' href='https://www.w3.org/TR/epub-33/#dfn-dc-date'>" + infoText + "</a>",
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
  var selectedOpts = $('#itemBox option:selected');
  if (selectedOpts.length == 0) {
    alert("Nothing to move.");
    return;
  }
  createTable(selectedOpts.text(),"selectedBox");
  $(selectedOpts).remove();
}

//handle removing items from added metadata cloumn to available metadata column
function removeBtn(){ 
  var selectedOpts = $('#selectedBox .list-group-item.active');
  if (selectedOpts.length == 0) {
      alert("Nothing to move.");
      return;
  }
  var metadataText = $("#selectedBox .list-group-item.active>table>thead").text();
  var optionElem = document.createElement('option');
  optionElem.setAttribute('value', metadataText.toLowerCase().replace(/\s/g,''));
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
  $("#selectedBox #"+ metadataText).remove();
}

//create table for each metadata 
function createTable(tableTitle, elemID){
  var bookDetObj = parseBookData()
  // check if the table doesn't have values
  if (bookDetObj[tableTitle] == undefined) {
    createNewTable(tableTitle, elemID);
    return;
  }
  // check if the table is already exisit for the table title
  if (checkAddedList(tableTitle) == 1){
    return;
  }
  var tbl = document.createElement('table');
  //tbl.style.width = '100%';
  tbl.setAttribute('class', 'table table-sm table-bordered table-striped');
  tbl.setAttribute('contenteditable', 'true');
  tableHeader(tbl, tableTitle)
  var tbdy = document.createElement('tbody');
  for(var val in bookDetObj[tableTitle]) {
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.appendChild(document.createTextNode(val));
    th.setAttribute('scope','row');
    th.setAttribute('contenteditable','false');
    tr.appendChild(th);
    var td = document.createElement('td');
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

//create table header element
function tableHeader(tbl, tableTitle){
  var thd = document.createElement('thead');
  var thdtr = document.createElement('tr');
  var thdth = document.createElement('th');
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
  var metadata = document.getElementById(elemID)
  var aElem = document.createElement('a');
  aElem.setAttribute('class', 'list-group-item list-group-item-action');
  aElem.setAttribute('href', '#');
  aElem.setAttribute('id', tableTitle);
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
    var title = $(this).closest('table').children('thead').text();
    var key = $(this).closest('tr').children()[0].innerText;
    updateBookData(title, key, 'delete')
    $(this).closest('tr').html('');
  }
  });

  $("#selectedBox i.bi-pencil-square").on("click", function(e) {
    if($(this)){
      //show the modal to add the new entry
      var title = $(this).closest('table').children('thead').text();
      var key = $(this).closest('tr').children()[0].innerText;
      var val = $(this).closest('td').text();
      var modalID = $(this).attr('data-bs-target');
      setModalValues(modalID, title, key, val)
    }
  });

  $("#selectedBox i.bi-plus-square-fill").on("click", function(e) {
    if($(this)){
      var title = $(this).closest('table').children('thead').text();
      var modalID = $(this).attr('data-bs-target');
      setModalValues(modalID, title, '', '','add');
      //check if the fade div is already exist
      if ($("#modal-fade").length == 0){
        // create div to appy the fading when the modal opens
        var elemDiv = document.createElement('div');
        elemDiv.setAttribute('class', 'modal-backdrop fade show');
        elemDiv.setAttribute('id', 'modal-fade');
        document.body.appendChild(elemDiv);
      }
    }
  });
}

function createNewTable(tableTitle, elemID){
  //create new table if the metadata doesn't have any data
  var tbl = document.createElement('table');
  tbl.setAttribute('class', 'table table-sm table-bordered table-striped');
  tableHeader(tbl, tableTitle)
  aElement(tbl, tableTitle, elemID)
}

function setModalValues(modalID, tableTitle, header, val, mode){
  //set the values to the modal and show it
  var body='';
  var bodyLabel='';
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
  var title = $('#editMetaModalLabel').text();
  var key = $('#editMetaBodyLabel').val();
  var val = $('#editMetaBody').val();
  updateBookData(title, key, 'update', val);
  closeModal('editMetaModal')
  //window.location.reload();
}

function addValue(){
  //Add the values to the table
  var title = $('#addMetaModalLabel').text();
  var key = $('#addMetaBodyLabel').val();
  var val = $('#addMetaBody').val();
  updateBookData(title, key, 'add', val);
  closeModal('addMetaModal')
}

// hide modal
function closeModal(modalID){
  // check if the fade div is exist
  var fadeDiv = document.getElementById("modal-fade");
  if (fadeDiv != null){
    document.body.removeChild(fadeDiv);
  }
  $('#'+modalID).hide();
}

function parseBookData(){
  var bookDetObj = JSON.parse(sessionStorage.getItem('bookDetails'))
  return bookDetObj
}

function updateBookData(title, key, mode, val){
  var bookDetObj = JSON.parse(sessionStorage.getItem('bookDetails'))
  if (mode == 'delete'){
    delete bookDetObj[title][key];
  } else {
    bookDetObj[title][key] = val;
  }
  sessionStorage.setItem("bookDetails", (JSON.stringify(bookDetObj)));
  updateAddedList();
}

// update the list to get the updated values
function updateAddedList(){
  $("#selectedBox .table").each(function(){
    if ($(this)){
      var currtitle = $(this).children('thead').text();
      $('#'+currtitle).remove();
      createTable(currtitle,"selectedBox");
    }
  });
}

//check if the metadata is already in the added list box
function checkAddedList(title){
  return $("#selectedBox #"+title).length
}

//Update info panel value
function updateInfo(){
  var selectedOpts = $('#itemBox option:selected');
  if (selectedOpts.length == 0) {
    return;
  }
  document.getElementById("metadataInfo").innerHTML = infoObj[selectedOpts.val()]
}