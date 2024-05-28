// All of the stuff below loads in the old projects!
let projects = new Array();

const projectChangedEvent = new CustomEvent("projectChanged");

let o = {
  directory: "",
  includeInstructions: true,
  includeNarrations: true,
  includeBookSettings: true,
};

sessionStorage.setItem("options", o);

//prettier-ignore
function loadProject(name) {
  let project;

  projects.forEach((value) => {
    if (value.name == name) {
      project = value;
    }
  });

  projectChangedEvent.detail = project;
}

window.BRIDGE.onRecentProjectsLoaded((value) => {
  let projList = document.getElementById("projectList");
  if (Array.isArray(value)) {
    value.forEach((project) => {
      let aElement = document.createElement("a");
      aElement.setAttribute("class", "list-group-item list-group-item-action");
      aElement.setAttribute("id", project.name);
      aElement.setAttribute("onclick", "loadProject(this.id)");
      aElement.setAttribute("tabindex", "0");
      let divElement = document.createElement("div");
      divElement.setAttribute("class", "d-flex w-100 justify-content-between");
      let headerElement = document.createElement("h6");
      headerElement.setAttribute("class", "mb-1");
      headerElement.appendChild(document.createTextNode(project.name));
      let smallElement = document.createElement("small");
      smallElement.appendChild(document.createTextNode(project.directory));
      divElement.appendChild(headerElement);
      divElement.appendChild(smallElement);
      aElement.appendChild(divElement);
      projList.appendChild(aElement);
    });
  }
  projects = value;
});

// handle project list group items on click
$(document).on("click", "#projectList .list-group-item", function (e) {
  if ($("#projectList .list-group-item").hasClass("active")) {
    $("#projectList .list-group-item").removeClass("active");
  }
  $(this).addClass("active");
  enterPressed++;
});

// handle project list group items on click
$(document).on("dblclick", "#projectList .list-group-item", function (e) {
  //check if the fade div is exist
  if ($("#modal-fade").length == 0) {
    // create div to appy the fading when the modal opens
    var elemDiv = document.createElement("div");
    elemDiv.setAttribute("class", "modal-backdrop fade show");
    elemDiv.setAttribute("id", "modal-fade");
    document.body.appendChild(elemDiv);
    document.getElementById("recentProjName").textContent = $(this).children("div").children("h6").text();
    $("#openRecentModal").show();
    $("#openRecentModal button[class='btn-close']").trigger("focus");
  }
});

// handel enter key press when tabbing to the recent project a item
var enterPressed = 0;
$(document).on("keypress", "#projectList a", function (e) {
  let keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    if (enterPressed === 0) {
      enterPressed++;
      this.click();
    } else if (enterPressed > 0) {
      e.preventDefault();
      enterPressed = 0;
      $("#projectList .list-group-item").trigger("dblclick");
    }
    return;
  }
});

function getOthSettings() {
  var selectedSettings = [];
  $("#otherSettings input:checked").each(function () {
    selectedSettings.push($(this).attr("value"));
  });
  return selectedSettings;
}

function loadJSONProject() {
  closeModal("openRecentModal");
  let name = $("#recentProjName").text();
  BRIDGE.loadJSON(name);
}

// hide modal
function closeModal(modalID) {
  // check if the fade div is exist
  var fadeDiv = document.getElementById("modal-fade");
  if (fadeDiv != null) {
    document.body.removeChild(fadeDiv);
  }
  $("#" + modalID).hide();
  $("#projectList .list-group-item.active").trigger("focus");
}

window.BRIDGE.onProjectData((value) => {
  resetFields();
  let projData = JSON.parse(value);
  document.getElementById("directory").value = projData["directory"];

  document.getElementById("projName").value = projData["name"];
  sessionStorage.setItem("projectName", projData["name"]);
  sessionStorage.setItem("bookDetails", JSON.stringify(projData["metadata"]));
  sessionStorage.setItem("pubLang", JSON.stringify(projData["languages"]));

  let o = {
    directory: projData["directory"],
    includeInstructions: projData["settings"].includes("instructions"),
    includeNarrations: projData["settings"].includes("audioNarr"),
    includeBookSettings: projData["settings"].includes("bookSettings"),
  };

  sessionStorage.setItem("options", JSON.stringify(o));

  langOpt = document.getElementById("publicationLanguage");
  if (Object.keys(projData["languages"]).length != 0) {
    for (let i = 0; i < langOpt.options.length; i++) {
      langOpt.options[i].selected = projData["languages"].indexOf(langOpt.options[i].value) >= 0;
    }
  }
  sessionStorage.setItem("pageDetails", JSON.stringify(projData["pages"]));
  if (Object.keys(projData["settings"]).length != 0) {
    for (let j = 0; j < projData["settings"].length; j++) {
      document.getElementById(projData["settings"][j]).checked = true;
    }
  }
  if (Object.keys(projData["fonts"]).length != 0) {
    for (let k = 0; k < projData["fonts"].length; k++) {
      document.getElementById(projData["fonts"][k]).checked = true;
    }
  }
  sessionStorage.setItem("selectedFonts", JSON.stringify(projData["fonts"]));
});
