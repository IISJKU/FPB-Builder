let selectedFonts = {}

// initialize metadata screen data
function initializeFonts() {
    if(sessionStorage.getItem("selectedFonts") != undefined){
        setSelectedFonts();
    }

    if(sessionStorage.getItem("selectedFonts") == undefined && $("#selectAll").prop('checked') == false){
        $("#selectAll").trigger('click');
    }
}

$(document).on("click", "#selectAll", function (e) {
    $(".fontItem").prop('checked', $(this).prop('checked'));
    getSelectedFonts();
});

$(document).on("click", "#addFont", function (e) {
    BRIDGE.setFontPath();
    $("#selectAll").prop('checked', false);
});

window.BRIDGE.onFontSet((value) => {
    addFontListElem(value);
});

function getSelectedFonts(){
    var selectedFonts = {};
    $(".fontItem:checkbox:checked").each(function () {
        //get label text
        let fontTxt = $(this).parent(0).children(1).text();
        let fontPath = $(this).data('path');
        selectedFonts[fontTxt] = fontPath;
        sessionStorage.setItem("selectedFonts", JSON.stringify(selectedFonts));
    });
    return selectedFonts;
}

// handle on change event for the font items checkbox elements
$(document).on("change", ".fontItem", function (e) {
    if ($('.fontItem:checked').length > 6){
        $("#selectAll").prop('checked', false);
        $(this).prop('checked', false);
        let msg = document.getElementById("toastBody");
        msg.innerHTML = "";
        let msgIcon = document.getElementById("toastIcon");
        msgIcon.setAttribute("class", "bi bi-info-square-fill");
        let msgText = document.getElementById("toastText");
        msgText.innerText=''
        msgText.appendChild(document.createTextNode(translateTxt('Info')))
        msg.appendChild(document.createTextNode(translateTxt("Maximum 6 fonts can be selected.")));
        $("#toastMessage").show().delay(5000).fadeOut(4000);
        return;
    }
    getSelectedFonts();
   if ($(this).is(':checked') == false && $("#selectAll").prop('checked') == true){
        $("#selectAll").prop('checked', false);
   }
   if ($('.fontItem').length == $('.fontItem:checked').length){
    $("#selectAll").prop('checked', true);
   }
});

function setSelectedFonts(fonts){
    if (fonts == undefined || fonts=='') fonts = parseSessionData("selectedFonts");
    for (let val in fonts) {
        let fontId = $("#fontList label:contains("+val+")").attr('for');
        if (fontId == undefined){
            addFontListElem(fonts[val]);
            fontId = $("#fontList label:contains("+val+")").attr('for');
        }
        $("#"+fontId).prop('checked', true);
    }
    $('.fontItem').trigger('change');
}

function addFontListElem(val){
    let lastInd= val.lastIndexOf("\\") + 1;
    let extIndex= val.indexOf(".");
    let fontText = val.slice(lastInd,extIndex)
    let fontList = document.getElementById("fontList");
    let liElement = document.createElement("li");
    liElement.setAttribute("class", "list-group-item");
    let liInput = document.createElement("input");
    liInput.setAttribute("class", "custom-control-input fontItem");
    liInput.setAttribute("type", "checkbox");
    liInput.setAttribute("id",camelCaseStr(fontText));
    liInput.setAttribute("name",camelCaseStr(fontText));
    liInput.setAttribute("aria-label", translateTxt("select item"));
    liInput.setAttribute("data-path", val);
    let inputLabel = document.createElement("label");
    inputLabel.setAttribute("class", "custom-control-label fontLbl");
    inputLabel.setAttribute("id", camelCaseStr(fontText)+'Lbl');
    inputLabel.setAttribute("for", camelCaseStr(fontText));
    inputLabel.appendChild(document.createTextNode(fontText));
    liElement.appendChild(liInput);
    liElement.appendChild(inputLabel);
    fontList.appendChild(liElement);
}