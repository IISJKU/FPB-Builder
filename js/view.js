const frontendDataManager = new FrontendDataManager();

function changeContent(event, controlledTab) {
  let tabTitle = event.textContent.trim();
  let oldPage = $("#tabTitle").text();

  frontendDataManager.sendDataToBackend(oldPage);

  $("#tabTitle").text(tabTitle);

  if (tabTitle == "Metadata") {
    $("#publicationLanguage").trigger("change");
    initializeMetadata();
  }
  if (tabTitle == "Spine") {
    $("#publicationLanguage").trigger("change");
    initializeSpine();
  }
  if ($("#listTab .tablinks").hasClass("active")) {
    let activeContentId = $("#listTab .tablinks.active").attr("aria-controls");
    document.getElementById(activeContentId).style.display = "none";
    $("#listTab .tablinks").removeClass("active");
  }
  document.getElementById(controlledTab).style.display = "contents";
  $(event).addClass("active");
}

// create icon element with it's attributes
function createIcon(appendElem, iconClass, alt, elemId) {
  let icon = document.createElement("i");
  icon.setAttribute("class", iconClass);
  icon.setAttribute("alt", alt);
  icon.setAttribute("tabindex", "0");
  if (elemId != "" && elemId != undefined) {
    icon.setAttribute("id", elemId);
  }
  appendElem.appendChild(icon);
}

// return item JSON parsed details session storage object
function parseSessionData(item) {
  let sessionObj = JSON.parse(sessionStorage.getItem(item));
  return sessionObj;
}

// return JSON parsed specific element data in item parameter session storage and if the element is not exisit it returns 0
function getSessionElem(item, elem) {
  let SessionDetObj = JSON.parse(sessionStorage.getItem(item));
  if (!item.hasOwnProperty(elem) || Object.keys(SessionDetObj[elem]).length == 0) {
    return 0;
  }
  return SessionDetObj[elem];
}

// Function to hide the Spinner 
function hideSpinner() { 
  document.getElementById('spinner').style.display = 'none'; 
}  

function resetFields(){
  sessionStorage.clear();
  //sessionStorage.removeItem("bookDetails");
  //sessionStorage.removeItem("pubLang");
  //sessionStorage.removeItem("pageDetails");
  document.getElementById('directory').value = '';
  document.getElementById('projName').value =  '';
  langOpt = document.getElementById('publicationLanguage');
  for (let i = 0; i < langOpt.options.length; i++) {
    if (langOpt.options[i].value == 'EN'){
      langOpt.options[i].selected = true;
    }else {
      langOpt.options[i].selected = false;
    }
  }
  $('#otherSettings input:checked').each(function() {
    $(this).prop('checked', false);
  });
}