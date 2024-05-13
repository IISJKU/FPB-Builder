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

function compareData(data) {
  // set initial value as they are similar
  let checkStatus = 1;
  if (data == "" || data == undefined || data == 'undefined') {
    checkStatus = 0;
    return checkStatus;
  }
  if (document.getElementById('directory').value !=  data['directory']) checkStatus = 0;
  if (document.getElementById('projName').value !=  data['name']) checkStatus = 0;
  let bookDetObj = parseSessionData("bookDetails");
  if (!objEqCheck(bookDetObj, data['metadata'])) checkStatus = 0;
  let pageDetailsObj = parseSessionData("pageDetails");
  if (!objEqCheck(pageDetailsObj, data['pages'])) checkStatus = 0;
  langOpt = document.getElementById('publicationLanguage');
  if (Object.keys(data['languages']).length != 0) {
    langArr =[];
    for (let i in langOpt.selectedOptions) {
     if(langOpt.selectedOptions[i].value != undefined) langArr.push(langOpt.selectedOptions[i].value)
    }
  }
  if (!arrEq(langArr, data['languages'])) checkStatus = 0;
  if (Object.keys(data['settings']).length != 0) {
    if (!arrEq(getOthSettings(), data['settings'])) checkStatus = 0;
  }
  return checkStatus;
};

//compare and check arrays
const arrEq = (arr1, arr2) =>
arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);

//check object equality 
function objEqCheck(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !objEqCheck(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }

  return true;
}

//helper function to check the type of the object
function isObject(object) {
  return object != null && typeof object === 'object';
}

//save data button function 
function saveDataBtn(){
  if (checkRequired() == true) BRIDGE.saveDataBtn();
}

//check required fields before pressing save button or closing the application
function checkRequired(){
  initializeReqFocus();
  var emptyProjFields = formFilter('ProjectForm');
  var emptyMetaFields = formFilter('metaForm');

  emptyFields(emptyProjFields, 'project-list');
  emptyFields(emptyMetaFields, 'metadata-list');
  
  if (emptyProjFields != 0 || emptyMetaFields != 0) {
    error = document.getElementById("error");
    error.innerHTML = '';
    let div = document.createElement("div");
    div.setAttribute("class", "col-md-12");
    let header = document.createElement("h4");
    header.appendChild(document.createTextNode('Please fill all mandatory fields (highlighted in red)'));
    div.appendChild(header);
    error.appendChild(div);
    $('#error').show();
    return false;
  }
  return true;
}

//Initialize application tabs when the application finish load event
function initializeTabs(){
  $("#publicationLanguage").trigger("change");
  initializeMetadata();
  initializeSpine();
}

// initiate on focus out event for all required input
function initializeReqFocus(){
  $(document).on("focusout", "input[required]", function (e) {
    checkRequired();
  });
}

// return count of null required input fields
function formFilter(formId){
  let reqFields= $('#'+formId+' input:required').filter(function() {
    return $(this).val() === "";
  }).length;
  return reqFields;
}

// check if the required fields has empty required input and add exclamation triangle icon else hide error panel and remove the icon
function emptyFields(reqFields, listId){
  if (reqFields != 0) {
    let metaList = document.getElementById(listId);
    if($('#'+listId+' .bi-exclamation-triangle-fill').length == 0) createIcon(metaList, "bi bi-exclamation-triangle-fill", "error");
  }else{
    $('#error').hide();
    $('#'+listId+' i.bi-exclamation-triangle-fill').remove();
  }
}