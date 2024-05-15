$(document).on("click", "#selectAll", function (e) {
    $(".fontItem").prop('checked', $(this).prop('checked'));
});

$(document).on("click", "#addFont", function (e) {
    BRIDGE.setFontPath();
});

window.BRIDGE.onFontSet((value) => {
    console.log(value.replace(/\\/g, '/'))
    let fontText= value.lastIndexOf("\\") + 1;
    let extIndex= value.indexOf(".");
    let fontList = document.getElementById("fontList");
    let liElement = document.createElement("li");
    liElement.setAttribute("class", "list-group-item");
    //liElement.setAttribute("id", );
    let liInput = document.createElement("input");
    liInput.setAttribute("class", "custom-control-input fontItem");
    liInput.setAttribute("type", "checkbox");
    liInput.setAttribute("data-path", value);
    //liInput.setAttribute("name", );
    //liInput.setAttribute("aria-label", "select item");
    let inputLabel = document.createElement("label");
    inputLabel.setAttribute("class", "custom-control-label");
    //inputLabel.setAttribute("id", "");
    //inputLabel.setAttribute("for", "");
    inputLabel.appendChild(document.createTextNode(value.slice(fontText,extIndex)));
    liElement.appendChild(liInput);
    liElement.appendChild(inputLabel);
    fontList.appendChild(liElement);
});