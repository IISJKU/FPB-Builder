sessionStorage.setItem("pubLang", JSON.stringify($("#publicationLanguage").val()));

// add change event on publication languages option
$(document).on("change", "#publicationLanguage", function (e) {
  sessionStorage.setItem("pubLang", JSON.stringify($("#publicationLanguage").val()));
  updateAddedList(1, 0);
});

window.BRIDGE.onDirectorySet((value) => {
  $("#directory").val(value["filePaths"][0]);
  console.log(value["filePaths"][0]);
});

$(document).ready(() => {
  $("#directory").on("click", () => {
    console.log("wooood");
    BRIDGE.setFilePath();
  });
});
