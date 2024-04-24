sessionStorage.setItem("pubLang", JSON.stringify($("#publicationLanguage").val()));

let options = { directory: "", includeInstructions: false, includeNarrations: false, includeBookSettings: false };
sessionStorage.setItem("options", JSON.stringify(options));

// add change event on publication languages option
$(document).on("change", "#publicationLanguage", function (e) {
  sessionStorage.setItem("pubLang", JSON.stringify($("#publicationLanguage").val()));
  updateAddedList(1, 0);
});

$(document).on("change", "#audioNarrations", function (e) {
  options.includeNarrations = !options.includeNarrations;
  sessionStorage.setItem("options", JSON.stringify(options));
});
$(document).on("change", "#instructions", function (e) {
  options.includeInstructions = !options.includeInstructions;
  sessionStorage.setItem("options", JSON.stringify(options));
});
$(document).on("change", "#bookSettings", function (e) {
  options.includeBookSettings = !options.includeBookSettings;
  sessionStorage.setItem("options", JSON.stringify(options));
});

// save the values when the input element loses the focus
$(document).on("focusout", "#projName", function (e) {
  sessionStorage.setItem("projectName", this.value);
});

window.BRIDGE.onDirectorySet((value) => {
  $("#directory").val(value["filePaths"][0]);
  options.directory = value["filePaths"][0];
  sessionStorage.setItem("options", JSON.stringify(options));
});

$(document).ready(() => {
  $("#directory").on("click", () => {
    BRIDGE.setFilePath();
  });
});
