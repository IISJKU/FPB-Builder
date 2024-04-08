var pageDetails={
  'cover': { 
    'text': {
      'EN': "Little Red Riding Hood",
      'IT': "Cappuccetto Rosso",
    },
    'narration': {
      'EN': "Cover narr",
      'IT': "Cover narr",
    },
    'imagesScripts': {
      'Image': "C://user/image.jpg",
      'Style': "",
    },
    'alt': {
      'EN': "Little Red Riding Hood Alt",
      'IT': "Cappuccetto Rosso Alt",
    },
  },
  'credit': { 
    'text': {
      'EN': "Little Red Riding Hood",
      'IT': "Cappuccetto Rosso",
    },
    'narration': {
    },
    'imagesScripts': {
    },
    'alt': {
    },
  },
  '1': { 
    'text': {
      'EN': "page 1 title",
      'IT': "page 1 title",
    },
    'narration': {
      'EN': "page 1 narration",
      'IT': "page 1 narration",
    },
    'imagesScripts': {
      'Image': "C://user/image.xhtml",
      'Style': "",
    },
    'alt': {
      'EN': "page 1 Alt",
      'IT': "page 1 Alt",
    },
  },
};

// page orgnisation down arrow icon event 
$(document).on('click', '#pageList .bi-arrow-down', function(e) {
  var cItem = $(this).closest('a');
  var tItem = cItem.next('a');
  if (tItem.length == 0 || tItem.attr('id') == 'plusIcon' || tItem.attr('id') == 'credit'){
    //[1] to insert the item after the cover page
    cItem.insertBefore($(this).closest('div').children()[1]);
    return
  }
  cItem.insertAfter(tItem);
});

// page orgnisation up arrow icon event 
$(document).on('click', '#pageList .bi-arrow-up', function(e) {
  var cItem = $(this).closest('a');
  var tItem = cItem.prev('a');
  if (tItem.length == 0 || tItem.attr('id') == 'cover'){
    var childrenLength = $(this).closest('div').children().length
    //it should be -1 but -3 because of the plus list item and the credit page
    cItem.insertAfter($(this).closest('div').children()[childrenLength - 3]);
    return
  }
  cItem.insertBefore(tItem);
});

// delete page icon event 
$(document).on('click', '#deletePage', function(e) {
  if($(this)){
    elem = $("#pageList .list-group-item.active").attr('id');
    //activate the previous page and get all it's details
    $("#pageList .list-group-item.active").prev('a').addClass("active");
    //delete the page element
    $('#pageList #'+elem).remove();
    //update the page details for the activated page
    fillData()
  }
});

// add new page icon event 
$(document).on('click', '#plusIcon', function(e) {
  pageId = createPage();
  $('#pageList #'+pageId).trigger("click");
});

// handle page list group items
$(document).on('click', "#pageList .list-group-item", function(e) {
  if(e.target.id=='plusIcon' || e.target.id==''){
    return
  }
  if($("#pageList .list-group-item").hasClass("active")){
    $("#pageList .list-group-item").removeClass("active");
  }
  
  $(e.target).addClass("active");
  fillData()
});

// browse button event for xhtml image
$(document).on('click', '#openImageXHTML', function(e) {
  BRIDGE.openImageXHTML();
});

// browse button event for narrations audio
$(document).on('click', '.narrations', function(e) {
  BRIDGE.narrations();
});

// browse button event for the cover image
$(document).on('click', '#coverImage', function(e) {
  BRIDGE.coverImage();
});

// browse button event for the other files
$(document).on('click', '.otherFiles', function(e) {
  BRIDGE.otherFiles();
});



//Add new page anchor element 
function createPage(){
  var pageLength = 0;
  var pages = document.getElementById('pageList');
  var creditPage = document.getElementById('credit');
  var aElem = document.createElement('a');
  pageLength = $('#pageList a').length - 2;
  aElem.setAttribute('href', '#');
  aElem.setAttribute('id', pageLength);
  aElem.setAttribute('class', 'list-group-item list-group-item-action');
  var elemText= document.createTextNode('Page '+pageLength);
  aElem.appendChild(elemText);
  //Create up and down icons to the element
  createIcon(aElem, 'bi bi-arrow-up icons','Move the page up');
  createIcon(aElem, 'bi bi-arrow-down icons','Move the page down');
  //add new page before the credit page
  pages.insertBefore(aElem, creditPage);
  return pageLength
}

//empty fields for new page
function newPageContent(){
  $('#contentBox table').each(function(){
    $(this).find('tbody').each(function(){
      //if ($(this).attr('contenteditable') != 'false'){}
      $(this).html('');
    })
  })
}

//fill fields with the page details 
function fillData(){
  var page = $("#pageList .list-group-item.active");
  var pageId = $("#pageList .list-group-item.active").attr('id');
  var pageLabel = document.getElementById('contentBoxLabel');
  $('#contentBoxLabel').text(page.text());
  if (pageId !='cover' && pageId !='credit'){
    createIcon(pageLabel, 'bi bi-trash3-fill icons','delete page', 'deletePage')
  }
   /*if (!pageDetails[pageId]){
    newPageContent();
    //return
  }*/
  $('#contentBox table').each(function(){
    var table =  $(this);
    var theadTxt = $(this).children('thead').children('tr').children('th');
    var section = theadTxt.attr('name');
    $(this).find('tbody').html('');
    createTableBody(table, pageId, section);
  })
}

//create body of the table based on the filled data
function createTableBody(tbl, pageId, section){
  var tbdy = document.createElement('tbody');
  if(section =='text' || section =='alt' || section =='narration'){
    createLangRows(tbl, tbdy, pageId, section);
    return;
  }
  if (!(pageDetails[pageId]) || !(pageDetails[pageId][section])){
    newImagesScripts(tbl, tbdy)
    return;
  }
  for(var val in pageDetails[pageId][section]) { 
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.appendChild(document.createTextNode(val));
    th.setAttribute('scope','row');
    th.setAttribute('contenteditable','false');
    tr.appendChild(th);
    var td = document.createElement('td');
    td.appendChild(document.createTextNode(pageDetails[pageId][section][val]));
    if (section =='imagesScripts'){
      var browseBtn = document.createElement('button');
      browseBtn.setAttribute('type', 'button');
      browseBtn.setAttribute('alt', 'Browse images and scripts button');
      if(pageId =='cover' && val =='Image'){
        browseBtn.setAttribute('class', 'btn btn-secondary browseBtn');
        browseBtn.setAttribute('id' , 'coverImage');
      } else if (val =='Image'){
        browseBtn.setAttribute('class', 'btn btn-secondary browseBtn');
        browseBtn.setAttribute('id' , 'openImageXHTML');
      }else if (val !='Image'){
        browseBtn.setAttribute('class', 'btn btn-secondary browseBtn otherFiles');
      }
      btnText= document.createTextNode('Browse');
      browseBtn.appendChild(btnText);
      td.append(browseBtn);
    }
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.append(tbdy);
}

// Create selected languages rows in the tables
function createLangRows(tbl, tbdy, pageId, section){
  if(pageId =='credit' && (section =='narration' || section =='alt')){
    return;
  }
  var value = '';
  var langs = JSON.parse(sessionStorage.getItem("pubLang"));
  for (let i = 0; i < langs.length; i++) {
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.appendChild(document.createTextNode(langs[i]));
    th.setAttribute('scope','row');
    th.setAttribute('class','langHeader');
    th.setAttribute('contenteditable','false');
    tr.appendChild(th);
    var td = document.createElement('td');
    if (pageDetails[pageId] && pageDetails[pageId][section]){
      value = pageDetails[pageId][section][langs[i]];
    }
    if (value != '' && value != undefined && value != 'undefined'){
      td.appendChild(document.createTextNode(value));
    }else{
      td.appendChild(document.createTextNode(''));
    }
    if (section =='narration') {
      var browseBtn = document.createElement('button');
      browseBtn.setAttribute('type', 'button');
      browseBtn.setAttribute('alt', 'Browse narration button');
      browseBtn.setAttribute('class', 'btn btn-secondary browseBtn narrations');
      btnText= document.createTextNode('Browse');
      browseBtn.appendChild(btnText);
      td.append(browseBtn);
    }
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.append(tbdy);
}

//create images and scripts panel for new pages 
function newImagesScripts(tbl, tbdy){
  var tr = document.createElement('tr');
  var th = document.createElement('th');
  th.appendChild(document.createTextNode('Image'));
  th.setAttribute('scope','row');
  th.setAttribute('contenteditable','false');
  tr.appendChild(th);
  var td = document.createElement('td');
  var browseBtn = document.createElement('button');
  browseBtn.setAttribute('type', 'button');
  browseBtn.setAttribute('alt', 'Browse images and scripts button');
  browseBtn.setAttribute('class', 'btn btn-secondary browseBtn');
  browseBtn.setAttribute('id' , 'openImageXHTML');
  btnText= document.createTextNode('Browse');
  browseBtn.appendChild(btnText);
  td.append(browseBtn);
  tr.appendChild(td);
  tbdy.appendChild(tr);
  tbl.append(tbdy);
}

