function changeTitle(event){
    var tabTitle = event.text.trim();
    $('#tabTitle').text(tabTitle);
    
    if (tabTitle=='Metadata'){
        createTable('Title',"selectedBox");
        createTable('Identifier',"selectedBox");
    }
}