let frontendDataManager = new FrontendDataManager();

function changeContent(event, controlledTab) {
  let tabTitle = event.textContent.trim();
  let oldPage = $("#tabTitle").text();

  frontendDataManager.sendDataToBackend(oldPage);

  $("#tabTitle").text(tabTitle);

  if (tabTitle == translateTxt("Metadata")) {
    //$("#publicationLanguage").trigger("change");
    initializeMetadata();
  }
  if (tabTitle == translateTxt("Spine")) {
    $("#publicationLanguage").trigger("change");
    initializeSpine();
  }
  if (tabTitle == translateTxt("Fonts")) {
    initializeFonts();
  }
  if ($("#listTab .tablinks").hasClass("active")) {
    let activeContentId = $("#listTab .tablinks.active").attr("aria-controls");
    document.getElementById(activeContentId).style.display = "none";
    $("#listTab .tablinks").removeClass("active");
  }
  document.getElementById(controlledTab).style.display = "contents";
  $(event).addClass("active");
  if (document.querySelector('#'+ event.id + ' .bi-exclamation-triangle-fill') != null) checkRequired();
}

// handle on change for the application language
$(document).on("change", "#appLang", function (e) {
  translate();
  sessionStorage.setItem("appLanguage", $(this).val());
  BRIDGE.saveSettings($(this).val());
  BRIDGE.reloadRecentProj();
});

// create icon element with it's attributes
function createIcon(appendElem, iconClass, aria, elemId) {
  let icon = document.createElement("i");
  icon.setAttribute("class", iconClass);
  icon.setAttribute("aria-label", aria);
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

function resetFields() {
  rmSessionItem();
  document.getElementById("directory").value = "";
  document.getElementById("projName").value = "";
  langOpt = document.getElementById("publicationLanguage");
  for (let i = 0; i < langOpt.options.length; i++) {
    if (langOpt.options[i].value == "EN") {
      langOpt.options[i].selected = true;
    } else {
      langOpt.options[i].selected = false;
    }
  }
  $("#otherSettings input:checked").each(function () {
    $(this).prop("checked", false);
  });

  $("#fontList input:checked").each(function () {
    $(this).prop("checked", false);
  });
}

function rmSessionItem() {
  sessionStorage.removeItem("bookDetails");
  sessionStorage.removeItem("pageDetails");
  sessionStorage.removeItem("pubLang");
  sessionStorage.removeItem("projectName");
  sessionStorage.removeItem("selectedFonts");
  sessionStorage.removeItem("options");
}

function compareData(data) {
  // set initial value as they are similar
  let checkStatus = 1;
  if (data == "" || data == undefined || data == "undefined") {
    checkStatus = 0;
    return checkStatus;
  }
  if (document.getElementById("directory").value != data["directory"]) checkStatus = 0;
  if (document.getElementById("projName").value != data["name"]) checkStatus = 0;
  let bookDetObj = parseSessionData("bookDetails");
  if (!objEqCheck(bookDetObj, data["metadata"])) checkStatus = 0;
  let pageDetailsObj = parseSessionData("pageDetails");
  if (!objEqCheck(pageDetailsObj, data["pages"])) checkStatus = 0;
  langOpt = document.getElementById("publicationLanguage");
  if (Object.keys(data["languages"]).length != 0) {
    langArr = [];
    for (let i in langOpt.selectedOptions) {
      if (langOpt.selectedOptions[i].value != undefined) langArr.push(langOpt.selectedOptions[i].value);
    }
  }
  if (!arrEq(langArr, data["languages"])) checkStatus = 0;
  if (Object.keys(data["settings"]).length != 0) {
    if (!arrEq(getOthSettings(), data["settings"])) checkStatus = 0;
  }
  if (Object.keys(data["fonts"]).length != 0) {
    if (!objEqCheck(getSelectedFonts(), data["fonts"])) checkStatus = 0;
  }
  return checkStatus;
}

//compare and check arrays
const arrEq = (arr1, arr2) => arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);

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
    if ((areObjects && !objEqCheck(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false;
    }
  }
  return true;
}

//helper function to check the type of the object
function isObject(object) {
  return object != null && typeof object === "object";
}

//save data button function
function saveDataBtn() {
  if (checkRequired() == true) {
    if ($("#toastMessage").is(':visible')) $("#toastMessage").hide();
    BRIDGE.saveDataBtn();
    let msg = document.getElementById("toastBody");
    msg.innerHTML = "";
    let msgIcon = document.getElementById("toastIcon");
    msgIcon.setAttribute("class", "bi bi-check-square-fill");
    let msgText = document.getElementById("toastText");
    msgText.innerText=''
    msgText.appendChild(document.createTextNode(translateTxt('Confirmation')))
    msg.appendChild(document.createTextNode(translateTxt("Your project has been saved successfully.")));
    $("#toastMessage").show().delay(5000).fadeOut(4000);
  } 
}

//check required fields before pressing save button or closing the application
function checkRequired() {
  if ($("#toastMessage").is(':visible')) $("#toastMessage").hide();
  let emptyProjFields = formFilter("ProjectForm");
  let emptyMetaFields = formFilter("metaForm");
  let spineErr = checkSpineError();
  emptyFields(emptyProjFields, "project-list");
  emptyFields(emptyMetaFields, "metadata-list");
  emptyFields(spineErr, "spine-list");
  if (spineErr != 0) emptyFields(spineErr, "spine-list");

  if (emptyProjFields != 0 || emptyMetaFields != 0 || spineErr != 0 ) {
    error = document.getElementById("toastBody");
    error.innerHTML = "";
    let exIcon = document.getElementById("toastIcon");
    exIcon.setAttribute("class", "bi bi-exclamation-triangle-fill");
    let errText = document.getElementById("toastText");
    errText.innerText=''
    errText.appendChild(document.createTextNode(translateTxt('Error')))
    if (emptyProjFields != 0 || emptyMetaFields != 0) error.appendChild(document.createTextNode(translateTxt("Please fill all mandatory fields (highlighted in red).")));
    if ((emptyProjFields != 0 || emptyMetaFields != 0) && spineErr != 0) error.appendChild(document.createElement("br"));
    if (spineErr != 0) checkSpineData(error);
    $("#toastMessage").show().delay(5000).fadeOut(4000);
    return false;
  }
  if ($("#toastIcon").hasClass("bi-exclamation-triangle-fill")) $("#toastMessage").hide();
  return true;
}

//Initialize application tabs when the application finish load event
function initializeTabs() {
  if (sessionStorage.getItem("translation") == undefined) {
    translationArr();
  }
  $("#publicationLanguage").trigger("change");
  initializeMetadata();
  initializeSpine();
  initializeFonts();
}

// return count of null required input fields
function formFilter(formId) {
  let reqFields = $("#" + formId + " input:required").filter(function () {
    return $(this).val() === "";
  }).length;
  return reqFields;
}

// check page details session variable data errors and return the apropriate error text
function checkSpineData(errorMsg){
  let newLineFlag = false;
  let publicationLangs = JSON.parse(sessionStorage.getItem("pubLang"));
  let spineData = parseSessionData("pageDetails");
  if (!spineData['cover']['imagesScripts'].hasOwnProperty('Image')){
    if (newLineFlag == true) errorMsg.appendChild(document.createElement("br"));
    errorMsg.appendChild(document.createTextNode(translateTxt('Cover image is required Please add it.')));
    newLineFlag = true;
  }else{
    for (let i = 0; i < publicationLangs.length; i++) {
      if(Object.keys(spineData['cover']['imagesScripts']['Image']).length == 0 || spineData['cover']['imagesScripts']['Image'][publicationLangs[i]] == '' || spineData['cover']['imagesScripts']['Image'][publicationLangs[i]] == undefined){
        if (newLineFlag == true) errorMsg.appendChild(document.createElement("br"));
        errorMsg.appendChild(document.createTextNode(publicationLangs[i] + ' '+ translateTxt('Cover image is required Please add it.')));
        newLineFlag = true;
      }
    }
  }
  for (let value in spineData) {
    let pageName = spineData[value]['name'] == undefined ? value : spineData[value]['name'];
    if (spineData[value]['imagesScripts'].hasOwnProperty('missing') && Object.keys(spineData[value]['imagesScripts']['missing']).length != 0){
      if (newLineFlag == true) errorMsg.appendChild(document.createElement("br"));
      errorMsg.appendChild(document.createTextNode(translateTxt("Please resolve the missing dependencies for the spine in")  + ' ' + pageName + '.'));
      newLineFlag = true;
    }
    if (publicationLangs.length == 0) return;
    if (value == 'credit'|| $('#audioNarr').is(':checked') == false) return;
    for (let i = 0; i < publicationLangs.length; i++) {
      if(Object.keys(spineData[value]['narration']).length == 0 || spineData[value]['narration'][publicationLangs[i]] == '' || spineData[value]['narration'][publicationLangs[i]] == undefined){
        if (newLineFlag == true) errorMsg.appendChild(document.createElement("br"));
        errorMsg.appendChild(document.createTextNode(translateTxt("The audio narrations setting is checked, please add") + ' '+ publicationLangs[i] + ' '+ translateTxt('narration to') + ' '+ pageName + '.'));
        newLineFlag = true;
      }
    }
  }
}

// return flag that check page details session variable of the missing required values
function checkSpineError(){
  let spineError = 0;
  let spineData = parseSessionData("pageDetails");
  if (!spineData['cover']['imagesScripts'].hasOwnProperty('Image') || spineData['cover']['imagesScripts']['Image'] == undefined){
    spineError = 1;
    return spineError;
  }
  for (let value in spineData) {
    if (spineData[value]['imagesScripts'].hasOwnProperty('missing') && Object.keys(spineData[value]['imagesScripts']['missing']).length != 0){
      spineError = 1;
      return spineError;
    }
    let publicationLangs = JSON.parse(sessionStorage.getItem("pubLang"));
    if (publicationLangs.length == 0) continue;
    if (value == 'credit'|| $('#audioNarr').is(':checked') == false) continue;
    for (let i = 0; i < publicationLangs.length; i++) {
      if(Object.keys(spineData[value]['narration']).length == 0 || spineData[value]['narration'][publicationLangs[i]] == '' || spineData[value]['narration'][publicationLangs[i]] == undefined){
        spineError = 1;
        return spineError;
      }
    }
  }
  return spineError;
}

// check if the required fields has empty required input and add exclamation triangle icon else hide error panel and remove the icon
function emptyFields(reqFields, listId) {
  if (reqFields != 0) {
    let metaList = document.getElementById(listId);
    if ($("#" + listId + " .bi-exclamation-triangle-fill").length == 0) createIcon(metaList, "bi bi-exclamation-triangle-fill", "error");
  } else {
    if ($("#toastIcon").hasClass("bi-exclamation-triangle-fill")) $("#toastMessage").hide();
    $("#" + listId + " i.bi-exclamation-triangle-fill").remove();
  }
}

// return the given string in a camel case form
function camelCaseStr(str) {
  return str
    .replace(/\s(.)/g, function ($1) {return $1.toUpperCase();})
    .replace(/\s/g, "")
    .replace(/^(.)/, function ($1) { return $1.toLowerCase();});
}

// returns processed array of translation.csv file
function translationArr() {
  let lines = [];
  fetch("translation.csv")
    .then((res) => res.text())
    .then(async (text) => {
      let allTextLines = text.split(/\r\n|\n/);
      let headers = allTextLines[0].split(";");
      for (let i = 1; i < allTextLines.length; i++) {
        let data = allTextLines[i].split(";");
        if (data.length == headers.length) {
          let tarr = {};
          for (let j = 0; j < headers.length; j++) {
            tarr[headers[j]] = data[j];
          }
          lines.push(tarr);
        }
      }
      await sessionStorage.setItem("translation", JSON.stringify(lines));
    })
    .catch((e) => console.error(e));
  return lines;
}

// search for value with a property in an array of objects
function arrObjSearch(arr, prop, value) {
  if (arr == null) return null;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][prop] === value) {
      return arr[i];
    }
  }
}

// translate the UI to the selected language
async function translate() {
  if (sessionStorage.getItem("translation") != undefined) {
    transArr = parseSessionData("translation");
  } else {
    transArr = translationArr();
  }
  document.getElementById("directory").setAttribute("placeholder", translateTxt("Browse"));
  document.getElementById("projName").setAttribute("placeholder", translateTxt("Project Name"));
  translateAriaLbls();
  let appLangOp = document.getElementById("appLang");
  let appLanVal = appLangOp.options[appLangOp.selectedIndex].value;
  //let currLang = sessionStorage.getItem("appLanguage");
  $(".langTxt").each(function () {
    let currTxt = $(this).text();
    let childNd = "";
    let selValue = "";
    if ($(this)[0].localName == "button" && $(this).children()[0]) {
      currTxt = $(this)[0].innerText.trim();
      childNd = $(this).children();
      selValue = arrSearch(transArr, currTxt);
      let transTxt = document.createTextNode(selValue[appLanVal]);
      $(this).html("");
      $(this).append(childNd);
      $(this).append(" ");
      $(this).append(transTxt);
      return;
    } else if ($(this)[0].localName == "p" && $(this).children()[0]) {
      childNd = $(this).children();
      $(this).children().remove();
      currTxt = $(this).text().trim();
      selValue = arrSearch(transArr, currTxt);
      let transTxt = document.createTextNode(selValue[appLanVal]);
      $(this).html("");
      $(this).append(transTxt);
      $(this).append(" ");
      $(this).append(childNd);
      return;
    }
    selValue = arrSearch(transArr, currTxt);
    if (selValue == undefined || selValue[appLanVal] == undefined) {
      $(this).text(currTxt);
    } else {
      $(this).text(selValue[appLanVal]);
    }
  });
}

// translate the given text to the selected language
function translateTxt(currText) {
  if (sessionStorage.getItem("translation") != undefined) {
    transArr = parseSessionData("translation");
  } else {
    transArr = translationArr();
  }
  if (transArr == null || transArr.length == 0) return currText;
  let appLangOp = document.getElementById("appLang");
  let appLanVal = appLangOp.options[appLangOp.selectedIndex].value;
  let childElement = "";
  if (currText.indexOf("<a") != -1 && currText.split("<a").length > 1) {
    let spTxt = currText.split("<a");
    currText = spTxt[0].trim();
    childElement = "<a" + spTxt[1];
  }
  let result = arrSearch(transArr, currText);
  if (result == undefined) return currText;
  if (childElement != "") return result[appLanVal] + " " + childElement;
  return result[appLanVal];
}

// search for value in an array of objects
function arrSearch(arr, value) {
  if (arr == null) return null;
  for (let i = 0; i < arr.length; i++) {
    for (let val in arr[i]) {
      if (arr[i][val] === value) {
        return arr[i];
      }
    }
  }
}

// translate the given text to english
function TranslateToEN(currTxt) {
  transArr = parseSessionData("translation");
  let appLangOp = sessionStorage.getItem("appLanguage");
  let res = arrObjSearch(transArr, appLangOp, currTxt);
  if (res == undefined) return currTxt;
  return res["EN"];
}

// handle application settings json file values callback
window.BRIDGE.onSetAppSettings((value) => {
  if (value == null) return;
  let appLangOp = document.getElementById("appLang");
  if (value.hasOwnProperty("appLanguage")) {
    appLangOp.value = value["appLanguage"];
    sessionStorage.setItem("appLanguage", value["appLanguage"]);
    $("#appLang").trigger("change");
    //initializeTabs();
  } else {
    let appLanValue = appLangOp.options[appLangOp.selectedIndex].value;
    sessionStorage.setItem("appLanguage", appLanValue);
    BRIDGE.saveSettings(appLanValue);
  }
});

// translate all application aria labels
function translateAriaLbls(){
  let labels = document.querySelectorAll("*[aria-label]");

  for (let i = 0; i < labels.length; i++) {
    let labelText = labels[i].getAttribute('aria-label');
    labels[i].setAttribute('aria-label',translateTxt(labelText));
  }
}