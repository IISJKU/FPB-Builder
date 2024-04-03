$(document).on('click', '.bi-arrow-down', function(e) {
  var cItem = $(this).closest('a');
  var tItem = cItem.next('a');
  if (tItem.length == 0 || tItem.attr('id') == 'plusIcon'){
    cItem.insertBefore($(this).closest('div').children()[0]);
    return
  }
  cItem.insertAfter(tItem);
});

$(document).on('click', '.bi-arrow-up', function(e) {
  var cItem = $(this).closest('a');
  var tItem = cItem.prev('a');
  if (tItem.length == 0){
    var childrenLength = $(this).closest('div').children().length
    // it should be -1 but -2 because of the plus list item 
    cItem.insertAfter($(this).closest('div').children()[childrenLength - 2]);
    return
  }
  cItem.insertBefore(tItem);
});


$(document).on('click', '#plusIcon', function(e) {
  createPage();
});

$(document).on('click', "#pageList .list-group-item", function(e) {
  if($("#pageList .list-group-item").hasClass("active")){
    $("#pageList .list-group-item").removeClass("active");
  }
  if(e.target.id=='plusIcon'){
    return
  }
  $(e.target).addClass("active");
  $('#contentBoxLabel').text(e.target.text);
});

$(document).on('click', '.openImageXHTML', function(e) {
  BRIDGE.openImageXHTML();
});

// Add new page anchor element 
function createPage(){
  var pageLength = 0;
  var pages = document.getElementById('pageList');
  var plusIcon = document.getElementById('plusIcon');
  var aElem = document.createElement('a');
  pageLength = $('#pageList a').length;
  aElem.setAttribute('href', '#');
  aElem.setAttribute('id', length);
  aElem.setAttribute('class', 'list-group-item list-group-item-action');
  var elemText= document.createTextNode('Page '+pageLength);
  aElem.appendChild(elemText);
  // Create up and down icons to the element
  createIcon(aElem, 'bi bi-arrow-up icons','Move the page up');
  createIcon(aElem, 'bi bi-arrow-down icons','Move the page down');
  pages.insertBefore(aElem, plusIcon);
  
}

