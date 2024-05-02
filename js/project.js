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
  let projList = document.getElementById("projectList");
  if (Array.isArray(value)) {
    value.forEach((project) => {
      let aElement = document.createElement("a");
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

// handle project list group items on click 
$(document).on("click", "#projectList .list-group-item", function (e) {
  if ($("#projectList .list-group-item").hasClass("active")) {
    $("#projectList .list-group-item").removeClass("active");
  }
  $(this).addClass("active")
});

// handle project list group items on click 
$(document).on("dblclick", "#projectList .list-group-item", function (e) {
  //check if the fade div is exist
  if ($("#modal-fade").length == 0){
    // create div to appy the fading when the modal opens
    var elemDiv = document.createElement('div');
    elemDiv.setAttribute('class', 'modal-backdrop fade show');
    elemDiv.setAttribute('id', 'modal-fade');
    document.body.appendChild(elemDiv);
    document.getElementById('recentProjName').textContent = $(this).children('div').children('h6').text();
    $("#openRecentModal").show();
  }
  
});

function getOthSettings(){
  var selectedSettings = [];
  $('#otherSettings input:checked').each(function() {
    selectedSettings.push($(this).attr('value'));
  });
  return selectedSettings
}

function loadJSONProject(){
  closeModal('openRecentModal');
  let name = $('#recentProjName').text();
  BRIDGE.loadJSON(name);
}

// hide modal
function closeModal(modalID){
  // check if the fade div is exist
  var fadeDiv = document.getElementById("modal-fade");
  if (fadeDiv != null){
    document.body.removeChild(fadeDiv);
  }
  $('#'+modalID).hide();
}

window.BRIDGE.onProjectData((value) => {
  resetFields();
  let projData = JSON.parse(value);
  document.getElementById('directory').value =  projData['directory'];
  document.getElementById('projName').value =  projData['name'];
  sessionStorage.setItem("bookDetails", JSON.stringify(projData['metadata']));
  sessionStorage.setItem("pubLang", JSON.stringify(projData['languages']));
  langOpt = document.getElementById('publicationLanguage');
  if (Object.keys(projData['languages']).length != 0) {
    for (let i = 0; i < langOpt.options.length; i++) {
      langOpt.options[i].selected = projData['languages'].indexOf(langOpt.options[i].value) >= 0;
    }
  }
  sessionStorage.setItem("pageDetails", JSON.stringify(projData['pages']));
  if (Object.keys(projData['settings']).length != 0) {
    for (let j = 0; j < projData['settings'].length; j++) {
    document.getElementById(projData['settings'][j]).checked = true;
    }
  }
});
