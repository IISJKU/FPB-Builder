function addBtn(){
    var selectedOpts = $('#itemBox option:selected');
    if (selectedOpts.length == 0) {
      alert("Nothing to move.");
    }

    $('#selectedBox').append($(selectedOpts).clone());
    $(selectedOpts).remove();
}

function removeBtn(){ 
    var selectedOpts = $('#selectedBox option:selected');
    if (selectedOpts.length == 0) {
       alert("Nothing to move.");
    }

    $('#itemBox').append($(selectedOpts).clone());
    $(selectedOpts).remove();
}