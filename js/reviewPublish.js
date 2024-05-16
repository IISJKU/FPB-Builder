let dirName = "FPB";

$(document).ready(() => {
  $("#generateBtn").on("click", () => {
    let frontendData = {};
    frontendData["languages"] = JSON.parse(sessionStorage.getItem("pubLang"));
    frontendData["bookDetails"] = JSON.parse(sessionStorage.getItem("bookDetails"));
    //frontendData["pages"] = pageDetails;
    frontendData["pages"] = JSON.parse(sessionStorage.getItem("pageDetails"));
    frontendData["options"] = JSON.parse(sessionStorage.getItem("options"));
    frontendData["dirName"] = dirName;
    console.log(dirName);

    sessionStorage.setItem("frontendData", JSON.stringify(frontendData));

    window.BRIDGE.generateEpub();
  });
});

$(document).on("change", "#pubFileName", function (e) {
  dirName = $("#pubFileName").val();
});
