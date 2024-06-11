let selectedFonts = {}

// initialize metadata screen data
function initializeFonts() {
    if($("#selectAll").prop('checked') == false){
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
    let lastInd= value.lastIndexOf("\\") + 1;
    let extIndex= value.indexOf(".");
    let fontText = value.slice(lastInd,extIndex)
    let fontList = document.getElementById("fontList");
    let liElement = document.createElement("li");
    liElement.setAttribute("class", "list-group-item");
    //liElement.setAttribute("id",);
    let liInput = document.createElement("input");
    liInput.setAttribute("class", "custom-control-input fontItem");
    liInput.setAttribute("type", "checkbox");
    liInput.setAttribute("id",camelCaseStr(fontText));
    liInput.setAttribute("name",camelCaseStr(fontText));
    liInput.setAttribute("aria-label", "select item");
    liInput.setAttribute("data-path", value);
    let inputLabel = document.createElement("label");
    inputLabel.setAttribute("class", "custom-control-label fontLbl");
    inputLabel.setAttribute("id", camelCaseStr(fontText)+'Lbl');
    inputLabel.setAttribute("for", camelCaseStr(fontText));
    inputLabel.appendChild(document.createTextNode(fontText));
    liElement.appendChild(liInput);
    liElement.appendChild(inputLabel);
    fontList.appendChild(liElement);
});

function getSelectedFonts(){
    var selectedFonts = {};
    $(".fontItem:checkbox:checked").each(function () {
        //get label text
        let fontTxt = $(this).parent(0).children(1).text();
        let fontPath = $(this).data('path');
        selectedFonts[fontTxt] = fontPath.replace(/\\/g, '/');
        //selectedFonts.push($(this).attr("id"));
        sessionStorage.setItem("selectedFonts", JSON.stringify(selectedFonts));
    });
    return selectedFonts;
}

// handle on change event for the font items checkbox elements
$(document).on("change", ".fontItem", function (e) {
    if ($('.fontItem:checked').length >= 6){
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
});