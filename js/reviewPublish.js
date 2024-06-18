$(document).on("click", "#publishBtn", function (e) {
  if (checkRequired() == false) return;
  saveDataBtn();
  let frontendData = {};
  frontendData["languages"] = JSON.parse(sessionStorage.getItem("pubLang"));
  frontendData["bookDetails"] = JSON.parse(sessionStorage.getItem("bookDetails"));
  frontendData["pages"] = JSON.parse(sessionStorage.getItem("pageDetails"));
  frontendData["options"] = JSON.parse(sessionStorage.getItem("options"));
  frontendData["dirName"] = $("#pubFileName").val();
  frontendData["selectedFonts"] = getSelectedFonts();
  frontendData["launch"] = $('#launchCheck').prop('checked');
  sessionStorage.setItem("frontendData", JSON.stringify(frontendData));
  window.BRIDGE.generateEpub();
});

$(document).on("change", "#pubFileName", function (e) {
});

window.BRIDGE.onPublishSuccessful(() => {
  let msg = document.getElementById("toastBody");
  msg.innerHTML = "";
  let msgIcon = document.getElementById("toastIcon");
  msgIcon.setAttribute("class", "bi bi-info-square-fill");
  let msgText = document.getElementById("toastText");
  msgText.innerText='';
  msgText.appendChild(document.createTextNode(translateTxt('Info')));
  msg.appendChild(document.createTextNode(translateTxt("The book has been successfully published.")));
  $("#toastMessage").show().delay(5000).fadeOut(4000);
});