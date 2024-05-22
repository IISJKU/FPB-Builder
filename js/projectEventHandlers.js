sessionStorage.setItem("pubLang", JSON.stringify($("#publicationLanguage").val()));

let options;
sessionStorage.setItem("options", JSON.stringify(options));

// add change event on publication languages option
$(document).on("change", "#publicationLanguage", function (e) {
  sessionStorage.setItem("pubLang", JSON.stringify($("#publicationLanguage").val()));
  updateAddedList(1, 0);
});

function getOptions() {
  if (JSON.parse(sessionStorage.getItem("options")) == null) {
    options = { directory: "", includeInstructions: false, includeNarrations: false, includeBookSettings: false };
    return options;
  } else {
    return JSON.parse(sessionStorage.getItem("options"));
  }
}

$(document).on("change", "#audioNarr", function (e) {
  options = getOptions();
  options.includeNarrations = !options.includeNarrations;
  sessionStorage.setItem("options", JSON.stringify(options));
});
$(document).on("change", "#instructions", function (e) {
  options = getOptions();
  options.includeInstructions = !options.includeInstructions;
  sessionStorage.setItem("options", JSON.stringify(options));
});
$(document).on("change", "#bookSettings", function (e) {
  options = getOptions();
  options.includeBookSettings = !options.includeBookSettings;
  sessionStorage.setItem("options", JSON.stringify(options));
});

// save the values when the input element loses the focus
$(document).on("focusout", "#projName", function (e) {
  sessionStorage.setItem("projectName", this.value);
});

window.BRIDGE.onDirectorySet((value) => {
  let options = sessionStorage.getItem("options");

  if (options == null || options == undefined) {
    options = {
      directory: "",
      includeInstructions: false,
      includeNarrations: false,
      includeBookSettings: false,
    };
  }

  $("#directory").val(value["filePaths"][0]);
  options.directory = value["filePaths"][0];
  sessionStorage.setItem("options", JSON.stringify(options));
});

$(document).on("click", "#directory", function (e) {
  BRIDGE.setFilePath();
});
