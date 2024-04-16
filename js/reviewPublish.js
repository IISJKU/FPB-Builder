$(document).ready(() => {
  $("#generateBtn").on("click", () => {
    let frontendData = {};
    frontendData["languages"] = JSON.parse(sessionStorage.getItem("pubLang"));
    frontendData["bookDetails"] = JSON.parse(sessionStorage.getItem("bookDetails"));
    frontendData["pages"] = pageDetails;

    sessionStorage.setItem("frontendData", JSON.stringify(frontendData));

    window.BRIDGE.generateEpub();
  });
});
