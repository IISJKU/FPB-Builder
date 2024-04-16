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
    BRIDGE.setFilePath();
  });
});

//
// All of the stuff below loads in the old projects!
let projects = new Array();

const projectChangedEvent = new CustomEvent("projectChanged");

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
  if (Array.isArray(value)) {
    value.forEach((project) => {
      $("#list-group2").append(
        '<a href="#" id="' +
          project.name +
          '" class="list-group-item list-group-item-action" onclick="loadProject(this.id)">' +
          '<div class="d-flex w-100 justify-content-between">' +
          '<h6 class="mb-1">' +
          project.name +
          "</h6>" +
          " <small>" +
          project.directory +
          "</small>" +
          "</div>" +
          "</a>"
      );
    });
  }

  projects = value;
});
