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
  let projList = document.getElementById("list-group2");
  if (Array.isArray(value)) {
    value.forEach((project) => {
      let aElement = document.createElement("a");
      aElement.setAttribute("href", "#");
      aElement.setAttribute("class", "list-group-item list-group-item-action");
      aElement.setAttribute("id", project.name);
      aElement.setAttribute("onclick", "loadProject(this.id)");
      let divElement = document.createElement("div");
      divElement.setAttribute("class", "d-flex w-100 justify-content-between");
      let headerElement = document.createElement("h6");
      headerElement.setAttribute("class", "mb-1");
      headerElement.appendChild(document.createTextNode(project.name))
      let smallElement = document.createElement("small");
      smallElement.appendChild(document.createTextNode(project.directory))
      divElement.appendChild(headerElement);
      divElement.appendChild(smallElement);
      aElement.appendChild(divElement);
      projList.appendChild(aElement);
    });
  }
  projects = value;
});
