
const accessMeta = ['Mode','Feature','Hazard','Summary','Mode Sufficient','Conforms to','Certified by'];
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

if (!sessionStorage.getItem("bookDetails")){
  sessionStorage.setItem("bookDetails", (JSON.stringify(bookDetails)));
}

function addBtn(){
  var selectedOpts = $('#itemBox option:selected');
  if (selectedOpts.length == 0) {
    alert("Nothing to move.");
    return;
  }
  createTable(selectedOpts.text(),"selectedBox");
  $(selectedOpts).remove();
}

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

function createTable(tableTitle, elemID){
  var bookDetObj = parseBookData()
  if (bookDetObj[tableTitle] == undefined) {
    createNewTable(tableTitle, elemID);
    return;
  }
  var tbl = document.createElement('table');
  //tbl.style.width = '100%';
  tbl.setAttribute('class', 'table table-sm table-bordered table-striped');
  tableHeader(tbl, tableTitle)
  var tbdy = document.createElement('tbody');
  for(var val in bookDetObj[tableTitle]) {
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.appendChild(document.createTextNode(val));
    th.setAttribute('scope','row');
    tr.appendChild(th);
    var td = document.createElement('td');
    td.appendChild(document.createTextNode(bookDetObj[tableTitle][val]));
    createIcon(td, 'bi bi-trash3-fill','delete entry')
    createIcon(td, 'bi bi-pencil-square','#editMetaModal','edit entry')
    tr.appendChild(td)
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  aElement(tbl, tableTitle, elemID)
}

function tableHeader(tbl, tableTitle){
  var thd = document.createElement('thead');
  var thdtr = document.createElement('tr');
  var thdth = document.createElement('th');
  thdth.setAttribute('scope','col');
  thdth.setAttribute('colspan','2');
  if (reqMeta.includes(tableTitle)){
    thdth.setAttribute('class','required');
  }
  thdthText= document.createTextNode(tableTitle);
  thdth.appendChild(thdthText);
  createIcon(thdth, 'bi bi-plus-square-fill', '#addMetaModal','Add new entry')
  thdtr.appendChild(thdth);
  thd.appendChild(thdtr);
  tbl.appendChild(thd);
}

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

function createIcon(appendElem, iconClass, modalID, alt){
  var icon = document.createElement('i');
  icon.setAttribute('class',iconClass);
  icon.setAttribute('alt',alt);
  if (modalID != null && modalID != '' && modalID != undefined && modalID != 'undefined'){
    icon.setAttribute('data-bs-toggle','modal');
    icon.setAttribute('data-bs-target',modalID);
  }
  
  appendElem.appendChild(icon);
}

function events(){
  $("#selectedBox .list-group-item").on("click", function(e) {
    if($("#selectedBox .list-group-item").hasClass("active")){
      $("#selectedBox .list-group-item").removeClass("active");
    }
    $(e.target).addClass("active");
  });

  $("i.bi-trash3-fill").on("click", function(e) {
  if($(this)){
    var title = $(this).closest('table').children('thead').text();
    var key = $(this).closest('tr').children()[0].innerText;
    updateBookData(title, key, 'delete')
    $(this).closest('tr').html('');
  }
  });

  $("i.bi-pencil-square").on("click", function(e) {
    if($(this)){
      var title = $(this).closest('table').children('thead').text();
      var key = $(this).closest('tr').children()[0].innerText;
      var val = $(this).closest('td').text();
      var modalID = $(this).attr('data-bs-target');
      setModalValues(modalID, title, key, val)
    }
  });

  $("i.bi-plus-square-fill").on("click", function(e) {
    if($(this)){
      var title = $(this).closest('table').children('thead').text();
      var modalID = $(this).attr('data-bs-target');
      setModalValues(modalID, title, '', '','add')
    }
  });

  const editModal = document.getElementById('editMetaModal')
  editModal.addEventListener('shown.bs.modal', function () {

  });
}

function createNewTable(tableTitle, elemID){
  var tbl = document.createElement('table');
  tbl.setAttribute('class', 'table table-sm table-bordered table-striped');
  tableHeader(tbl, tableTitle)
  aElement(tbl, tableTitle, elemID)
}

function setModalValues(modalID, tableTitle, header, val, mode){
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
}

function updateValue(){
  var title = $('#editMetaModalLabel').text();
  var key = $('#editMetaBodyLabel').val();
  var val = $('#editMetaBody').val();
  updateBookData(title, key, 'update', val)
  //window.location.reload();
}

function addValue(){
  var title = $('#addMetaModalLabel').text();
  var key = $('#addMetaBodyLabel').val();
  var val = $('#addMetaBody').val();
  updateBookData(title, key, 'add', val)
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

function updateAddedList(){
  // Add the list again to get the updated values
  $("#selectedBox .table").each(function(){
    if ($(this)){
      var currtitle = $(this).children('thead').text();
      $('#'+currtitle).remove();
      createTable(currtitle,"selectedBox");
    }
  });
}