function changeContent(event, controlledTab){
    var tabTitle = event.textContent.trim();
    $('#tabTitle').text(tabTitle);
    
    if (tabTitle=='Metadata'){
        createTable('Title',"selectedBox");
        createTable('Identifier',"selectedBox");
    }
    if($("#listTab .tablinks").hasClass("active")){
        var activeContentId = $("#listTab .tablinks.active").attr('aria-controls');
        document.getElementById(activeContentId).style.display = "none";
        $("#listTab .tablinks").removeClass("active");
        
    }
    document.getElementById(controlledTab).style.display = "contents";
    $(event).addClass("active");
}
