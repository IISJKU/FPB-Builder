function changeContent(event, controlledTab){
    var tabTitle = event.textContent.trim();
    $('#tabTitle').text(tabTitle);
    
    if (tabTitle=='Metadata'){
        createTable('Title',"selectedBox");
        createTable('Identifier',"selectedBox");
    }
    if (tabTitle=='Spine'){
        $('#publicationLanguage').trigger('change');
        fillData();
    }
    if($("#listTab .tablinks").hasClass("active")){
        var activeContentId = $("#listTab .tablinks.active").attr('aria-controls');
        document.getElementById(activeContentId).style.display = "none";
        $("#listTab .tablinks").removeClass("active");
        
    }
    document.getElementById(controlledTab).style.display = "contents";
    $(event).addClass("active");
}

// create icon element with it's attributes
function createIcon(appendElem, iconClass, alt, elemId, modalID){
    var icon = document.createElement('i');
    icon.setAttribute('class',iconClass);
    icon.setAttribute('alt',alt);
    if(elemId != '' && elemId != undefined){
        icon.setAttribute('id',elemId);
    }
    if (modalID != null && modalID != '' && modalID != undefined && modalID != 'undefined'){
      icon.setAttribute('data-bs-toggle','modal');
      icon.setAttribute('data-bs-target',modalID);
    }
    appendElem.appendChild(icon);
  }