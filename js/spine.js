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
      'EN': "",
      'IT': "",
    },
    'imagesScripts': {
      'Image': "",
      'Style': "",
    },
    'alt': {
      'EN': "",
      'IT': "",
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

$(document).on('click', '.bi-arrow-down', function(e) {
  var cItem = $(this).closest('a');
  var tItem = cItem.next('a');
  if (tItem.length == 0 || tItem.attr('id') == 'plusIcon' || tItem.attr('id') == 'credit'){
    //[1] to insert the item after the cover page
    cItem.insertBefore($(this).closest('div').children()[1]);
    return
  }
  cItem.insertAfter(tItem);
});

$(document).on('click', '.bi-arrow-up', function(e) {
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

$(document).on('click', '#plusIcon', function(e) {
  pageId = createPage();
  $('#pageList #'+pageId).trigger("click");
});

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

$(document).on('click', '#openImageXHTML', function(e) {
  BRIDGE.openImageXHTML();
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
  $('#contentBox tr').each(function(){
    $(this).find('td').each(function(){
      if ($(this).attr('contenteditable') != 'false'){
        $(this).text('');
      }
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
  if (!pageDetails[pageId]){
    newPageContent()
    return
  }
  $('#contentBox tr').each(function(){
    $(this).find('td').each(function(){
      var theadTxt = $(this).closest('table').children('thead').children('tr').children('th');
      var section = theadTxt.attr('name');
      var property = $(this).closest('tr').children()[0].innerText;
      $(this).text(pageDetails[pageId][section][property]);
    })
  })
}