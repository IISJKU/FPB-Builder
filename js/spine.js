let pageDetails = {
  cover: {
    text: {},
    narration: {},
    imagesScripts: {},
    alt: {},
  },
  credit: {
    text: {},
    narration: {},
    imagesScripts: {},
    alt: {},
  },
};

let emptyPage = {
  text: {
    EN: "",
    IT: "",
  },
  narration: {
    EN: "",
    IT: "",
  },
  imagesScripts: {
    Image: "",
  },
  alt: {
    EN: "",
    IT: "",
  },
};

// page orgnisation down arrow icon event
$(document).on("click", "#pageList .bi-arrow-down", function (e) {
  let pageDetailsObj = parseSessionData("pageDetails");

  let cItem = $(this).closest("a");
  let tItem = cItem.next("a");

  if (tItem.length == 0 || tItem.attr("id") == "plusIcon" || tItem.attr("id") == "credit") {
    //[1] to insert the item after the cover page
    cItem.insertBefore($(this).closest("div").children()[1]);
    return;
  } else {
    var t = pageDetailsObj[cItem.attr("id")];
    pageDetailsObj[cItem.attr("id")] = pageDetailsObj[tItem.attr("id")];
    pageDetailsObj[tItem.attr("id")] = t;
  }
  cItem.insertAfter(tItem);

  sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
  fillData();
});

// page orgnisation up arrow icon event
$(document).on("click", "#pageList .bi-arrow-up", function (e) {
  let cItem = $(this).closest("a");
  let tItem = cItem.prev("a");
  let pageDetailsObj = parseSessionData("pageDetails");
  if (tItem.length == 0 || tItem.attr("id") == "cover") {
    let childrenLength = $(this).closest("div").children().length;
    //it should be -1 but -3 because of the plus list item and the credit page
    cItem.insertAfter($(this).closest("div").children()[childrenLength - 3]);
    return;
  } else {
    var t = pageDetailsObj[cItem.attr("id")];
    pageDetailsObj[cItem.attr("id")] = pageDetailsObj[tItem.attr("id")];
    pageDetailsObj[tItem.attr("id")] = t;
  }
  cItem.insertBefore(tItem);

  sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
  fillData();
});

// delete page icon event
$(document).on("click", "#deletePage", function (e) {
  if ($(this)) {
    elem = $("#pageList .list-group-item.active").attr("id");
    //activate the previous page and get all it's details
    $("#pageList .list-group-item.active").prev("a").addClass("active");
    //delete the page element
    $("#pageList #" + elem).remove();
    //update the page details for the activated page
    fillData();
  }
});

// add new page icon event
$(document).on("click", "#plusIcon", function (e) {
  pageId = createPage();
  $("#pageList #" + pageId).trigger("click");
});

// handle page list group items
$(document).on("click", "#pageList .list-group-item", function (e) {
  if (e.target.id == "plusIcon" || e.target.id == "") {
    return;
  }
  if ($("#pageList .list-group-item").hasClass("active")) {
    $("#pageList .list-group-item").removeClass("active");
  }

  $(e.target).addClass("active");
  fillData();
  saveData();
});

// browse button event for xhtml image
$(document).on("click", "#importImage", function (e) {
  let path = $(this).data("path");
  BRIDGE.importImage(path);
});

let activeLang = "";
// browse button event for narrations audio
$(document).on("click", ".narrations", function (e) {
  activeLang = $(this).closest("tr").children("th").text();
  let path = $(this).data("path");
  let elemId = $(this).attr("id");
  BRIDGE.narrations(path, elemId);
});

// browse button event for the cover image
$(document).on("click", "#coverImage", function (e) {
  let path = $(this).data("path");
  BRIDGE.coverImage(path);
});

// browse button event for the other files
$(document).on("click", ".otherFiles", function (e) {
  let path = $(this).data("path");
  let elemId = $(this).attr("id");
  BRIDGE.otherFiles(path, elemId);
});

window.BRIDGE.onSetPath((value, elemId) => {
  if (value["canceled"] == true) return;
  let lastIdx = value["filePaths"][0].lastIndexOf("\\") + 1;
  let pthLength = value["filePaths"][0].length;
  let imgName = value["filePaths"][0].slice(lastIdx, pthLength);
  if (value.hasOwnProperty("type") && value["type"] == "cover") {
    $("#coverImage").val(imgName);
    $("#coverImage").attr("data-path", value["filePaths"][0]);
  } else {
    $("#"+ elemId).val(imgName);
    $("#"+ elemId).attr("data-path", value["filePaths"][0]);
    if ($("#"+ elemId).attr("data-missing") == 1){
      $("#"+ elemId).get(0).setCustomValidity('');
      $("#"+ elemId).attr("data-missing", 0);
    }
  }
});

window.BRIDGE.onImageLoaded((value) => {
  if (value["canceled"] == true) return;
  let lastIdx = value["imageFile"].lastIndexOf("\\") + 1;
  let pthLength = value["imageFile"].length;
  let imgName = value["imageFile"].slice(lastIdx, pthLength);
  $("#importImage").val(imgName);
  $("#importImage").attr("data-path", value["imageFile"]);
  let pageID = $("#pageList .list-group-item.active").attr("id");
  let pageDetailsObj = parseSessionData("pageDetails");
  pageDetailsObj[pageID]["name"] = value["imageFile"].slice(lastIdx, value["imageFile"].indexOf("."));
  if (pageID != "cover" && pageID != "credit") {
    if (pageDetailsObj[pageID].hasOwnProperty("name") && (pageDetailsObj[pageID]["name"] != "" || pageDetailsObj[pageID]["name"] != undefined)) {
      $("#pageList .list-group-item.active").text(pageDetailsObj[pageID]["name"]);
      //Create up and down icons to the element
      let pageElem = document.getElementById(pageID);
      createIcon(pageElem, "bi bi-arrow-up icons", "Move the page up");
      createIcon(pageElem, "bi bi-arrow-down icons", "Move the page down");
    }
  }
  if (typeof pageDetailsObj[pageID] != undefined && pageDetailsObj[pageID] != undefined) {
    let newarr = sortArr(value["foundFiles"]);
    //pageDetailsObj[pageID]["imagesScripts"]["Image"] = newarr;
    for (let i = 0; i < newarr.length; i++) {
      let tag = "";
      if (newarr[i].includes(".js")) tag = "Script";
      else if (newarr[i].includes(".mp3" || ".wav")) tag = "Audio";
      else if (newarr[i].includes(".css")) tag = "Style";
      let x = 1;
      while (pageDetailsObj[pageID]["imagesScripts"][tag + " " + x] != undefined) {
        x = x + 1;
      }
      pageDetailsObj[pageID]["imagesScripts"][tag + " " + x] = newarr[i];
    };
    sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
    let table = $('#contentBox #imagesScripts table');
    createTableBody(table, pageID, "imagesScripts");
    if (value["missingFiles"]) addMissScripts(value["missingFiles"], pageID);
  }
});

window.BRIDGE.onNarrationLoaded((value, elemId) => {
  if (value["canceled"] == true) return;
  let lastIdx = value[0].lastIndexOf("\\") + 1;
  let pthLength = value[0].length;
  let imgName = value[0].slice(lastIdx, pthLength);
  $("#"+ elemId).val(imgName);
  $("#"+ elemId).attr("data-path", value[0]);
  let pageID = $("#pageList .list-group-item.active").attr("id");
  let pageDetailsObj = parseSessionData("pageDetails");
  pageDetailsObj[pageID].narration[activeLang] = value[0];
  console.log(pageDetailsObj);
  sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
});

function initializeSpine() {
  if (sessionStorage.getItem("pageDetails") == null || sessionStorage.getItem("pageDetails") == "null") {
    sessionStorage.setItem("pageDetails", JSON.stringify(pageDetails));
  }
  let pageDetObj = parseSessionData("pageDetails");
  for (let val in pageDetObj) {
    if (Object.keys(pageDetObj[val]).length == 0 || val == "cover" || val == "credit" || $("#pageList #" + val).length > 0) {
      continue;
    }
    createPage(val);
  }
  fillData();
}

//Add new page anchor element
function createPage(id) {
  let pageLength = 0;
  let pages = document.getElementById("pageList");
  let creditPage = document.getElementById("credit");
  let aElem = document.createElement("a");
  pageLength = id;
  if (pageLength == "" || pageLength == undefined) pageLength = $("#pageList a").length - 2;
  aElem.setAttribute("href", "#");
  aElem.setAttribute("id", pageLength);
  aElem.setAttribute("class", "list-group-item list-group-item-action");
  let elemText = document.createTextNode("Page " + pageLength);
  aElem.appendChild(elemText);
  //Create up and down icons to the element
  createIcon(aElem, "bi bi-arrow-up icons", "Move the page up");
  createIcon(aElem, "bi bi-arrow-down icons", "Move the page down");
  //add new page before the credit page
  pages.insertBefore(aElem, creditPage);
  return pageLength;
}

//fill fields with the page details
function fillData() {
  let page = $("#pageList .list-group-item.active");
  let pageId = $("#pageList .list-group-item.active").attr("id");
  let pageLabel = document.getElementById("contentBoxLabel");
  pageLabel.innerText = page.text();
  if (pageId != "cover" && pageId != "credit") {
    createIcon(pageLabel, "bi bi-trash3-fill icons", "delete page", "deletePage");
  }
  $("#contentBox table").each(function () {
    let table = $(this);
    let theadTxt = $(this).children("thead").children("tr").children("th");
    let section = theadTxt.attr("name");
    $(this).find("tbody").html("");
    createTableBody(table, pageId, section);
  });
}

//create body of the table based on the filled data
function createTableBody(tbl, pageId, section) {
  let tbdy = document.createElement("tbody");
  if(tbl.find("tbody").length > 0){
    tbdy = tbl.children('tbody');
  }
  if (section == "text" || section == "alt" || section == "narration") {
    createLangRows(tbl, tbdy, pageId, section);
    return;
  }
  let pageDetObj = parseSessionData("pageDetails");
  if (!pageDetObj[pageId] || !pageDetObj[pageId][section] || Object.keys(pageDetObj[pageId][section]) == 0) {
    pageDetObj[pageId] = emptyPage;
    newImagesScripts(tbl, tbdy, pageId);
    return;
  }
  for (let val in pageDetObj[pageId][section]) {
    if (val == "missing"){
      addMissScripts(pageDetObj[pageId][section][val], pageId);
      continue;
    }
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(val));
    th.setAttribute("scope", "row");
    th.setAttribute("class", "header");
    tr.appendChild(th);
    let td = document.createElement("td");
    if (section == "imagesScripts") {
      let imageInput = document.createElement("input");
      imageInput.setAttribute("type", "imageInput");
      imageInput.setAttribute("alt", "Browse images and scripts button");
      imageInput.setAttribute("placeholder", "Browse");
      imageInput.setAttribute("title", "XHTML page image");
      imageInput.value = sliceName(pageDetObj[pageId][section][val]);
      imageInput.setAttribute("data-path", pageDetObj[pageId][section][val]);
      imageInput.setAttribute("id", camelCaseStr(val));
      if (pageId == "cover" && val == "Image") {
        imageInput.setAttribute("class", "form-control");
        imageInput.setAttribute("id", "coverImage");
      } else if (val == "Image") {
        imageInput.setAttribute("class", "form-control");
        imageInput.setAttribute("id", "importImage");
      } else if (val != "Image") {
        imageInput.setAttribute("class", "form-control otherFiles");
      }
      td.append(imageInput);
    }
    tr.appendChild(td);
    tbdy.append(tr);
  }
  tbl.append(tbdy);
}

// Create selected languages rows in the tables
function createLangRows(tbl, tbdy, pageId, section) {
  if (pageId == "credit" && (section == "narration" || section == "alt")) {
    return;
  }
  let value = "";
  let colVal = "";
  let textElem = "";
  let langs = JSON.parse(sessionStorage.getItem("pubLang"));
  for (let i = 0; i < langs.length; i++) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(langs[i]));
    th.setAttribute("scope", "row");
    th.setAttribute("class", "header");
    tr.appendChild(th);
    let td = document.createElement("td");
    let pageDetObj = parseSessionData("pageDetails");
    if (pageDetObj.hasOwnProperty(pageId) && Object.keys(pageDetObj[pageId]).length > 0 && pageDetObj[pageId] && pageDetObj[pageId][section]) {
      value = pageDetObj[pageId][section][langs[i]];
    }
    if (value != "" && value != undefined && value != "undefined") {
      colVal = value;
    }
    if (section == "alt") {
      textElem = document.createElement("input");
      textElem.setAttribute("type", "text");
      textElem.setAttribute("class", "form-control");
      textElem.value = colVal;
      td.appendChild(textElem);
    } else if (section == "narration") {
      let narrInput = document.createElement("input");
      narrInput.setAttribute("type", "narrInput");
      narrInput.setAttribute("class", "form-control narrations");
      narrInput.setAttribute("alt", "Browse narration button");
      narrInput.setAttribute("placeholder", "Browse");
      narrInput.setAttribute("title", "Browse xHTML image");
      narrInput.setAttribute("id", langs[i].toLowerCase()+'Narr');
      narrInput.value = sliceName(colVal);
      narrInput.setAttribute("data-path", colVal);
      td.append(narrInput);
    } else {
      textElem = document.createElement("textarea");
      textElem.setAttribute("class", "form-control");
      textElem.value = colVal;
      td.appendChild(textElem);
    }
    tr.appendChild(td);
    tbdy.append(tr);
  }
  tbl.append(tbdy);
}

//create images and scripts panel for new pages
function newImagesScripts(tbl, tbdy, pageID) {
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.appendChild(document.createTextNode("Image"));
  th.setAttribute("scope", "row");
  th.setAttribute("class", "header");
  tr.appendChild(th);
  let td = document.createElement("td");
  let imageInput = document.createElement("input");
  imageInput.setAttribute("type", "imageInput");
  if (pageID == "cover") {
    imageInput.setAttribute("class", "form-control");
    imageInput.setAttribute("id", "coverImage");
  } else {
    imageInput.setAttribute("class", "form-control");
    imageInput.setAttribute("id", "importImage");
  }
  imageInput.setAttribute("alt", "Browse images and scripts button");
  imageInput.setAttribute("placeholder", "Browse");
  imageInput.setAttribute("title", "Browse xHTML image");
  td.append(imageInput);
  tr.appendChild(td);
  tbdy.append(tr);
  tbl.append(tbdy);
}

function saveData() {
  let pageId = $("#pageList .list-group-item.active").attr("id");
  let pageDetObj = parseSessionData("pageDetails");
  $("#contentBox tbody tr").each(function () {
    let theadTxt = $(this).closest("table").children("thead").children("tr").children("th");
    let section = theadTxt.attr("name");
    let attr = $(this).children("th").text();
    if (pageDetObj[pageId] == undefined) {
      pageDetObj[pageId] = {};
    }
    if (pageDetObj[pageId][section] == undefined) {
      pageDetObj[pageId][section] = {};
    }
    //Change this later!
    if (attr != "Image") pageDetObj[pageId][section][attr] = $(this).children("td").children(0).val();
    if (section == 'narration' || section == "imagesScripts"){
      pageDetObj[pageId][section][attr] = $(this).children("td").children(0).attr('data-path');
    }
  });
  sessionStorage.setItem("pageDetails", JSON.stringify(pageDetObj));
}

// save the values when the input element loses the focus
$(document).on("focusout", "#contentBox input,#contentBox textarea", function (e) {
  if ($(this)) {
    saveData();
  }
});

//slice the given value to extract the file name with it's extenstion
function sliceName(value){
  if (value=="") return ""
  let lastIdx = value.lastIndexOf("\\") + 1;
  let pthLength =value.length;
  let retName = value.slice(lastIdx,pthLength);
  return retName
}

//after the user choose the xhtml image the page name and the page title in the content box  
function updatePageName(detObj, pageID){
  if (pageID !='cover' && pageID != 'credit'){
    if (detObj[pageID].hasOwnProperty("name") && (detObj[pageID]["name"] !='' || detObj[pageID]["name"] != undefined )){
      $("#pageList .list-group-item.active").text(detObj[pageID]["name"]);
      let pageLabel = document.getElementById("contentBoxLabel");
      pageLabel.innerText = detObj[pageID]["name"];
      createIcon(pageLabel, "bi bi-trash3-fill icons", "delete page", "deletePage");
      //Create up and down icons to the element
      let pageElem = document.getElementById(pageID);
      createIcon(pageElem, "bi bi-arrow-up icons", "Move the page up");
      createIcon(pageElem, "bi bi-arrow-down icons", "Move the page down");
    }
  }
}

//sort the given array based on the element extension
function sortArr(arr){
  let sortedArr = [];
  let jsArr = [];
  let cssArr = [];
  let audioArr = [];
  for (let x = 0; x < arr.length; x++) {
    if (arr[x].includes(".js")){
      jsArr.push(arr[x]);
    }else if (arr[x].includes(".css")){
      cssArr.push(arr[x]);
    }else if (arr[x].includes(".mp3" || ".wav")){
      audioArr.push(arr[x]);
    }
  }
  sortedArr = jsArr.concat(cssArr).concat(audioArr);
  return sortedArr;
}

function addMissScripts(filesArr, pageID){
  let newarr = sortArr(filesArr);
  let detObj = parseSessionData("pageDetails");
  detObj[pageID]["imagesScripts"]['missing']= {};
  for (let i = 0; i < newarr.length; i++) {
    let tag = "";
    if (newarr[i].includes(".js")) tag = "Script";
    else if (newarr[i].includes(".mp3" || ".wav")) tag = "Audio";
    else if (newarr[i].includes(".css")) tag = "Style";
    let x = itemNum(tag, detObj[pageID]["imagesScripts"]) + 1;
    while (detObj[pageID]["imagesScripts"]['missing'][tag + " " + x] != undefined) {
      x = x + 1;
    }
    if (!Object.values(detObj[pageID]["imagesScripts"]['missing']).includes(newarr[i])) detObj[pageID]["imagesScripts"]['missing'][tag + " " + x] = newarr[i];
  };
  sessionStorage.setItem("pageDetails", JSON.stringify(detObj));
  let table = $('#contentBox #imagesScripts table');
  let body = $('#contentBox #imagesScripts table tbody');
  missingDependencies(table, body, pageID);
}

//create missing dependencies body of the table based on the filled data
function missingDependencies(tbl, tbdy, pageId) {
  let pageObj = parseSessionData("pageDetails");
  for (let val in pageObj[pageId]['imagesScripts']['missing']) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(val));
    th.setAttribute("scope", "row");
    th.setAttribute("class", "header");
    tr.appendChild(th);
    let td = document.createElement("td");
    let imageInput = document.createElement("input");
    imageInput.setAttribute("type", "imageInput");
    imageInput.setAttribute("alt", "Browse images and scripts button");
    imageInput.setAttribute("class", "form-control otherFiles");
    imageInput.required = true;
    imageInput.setCustomValidity("Invalid");
    imageInput.setAttribute("data-missing", 1);
    imageInput.setAttribute("placeholder", "Browse");
    imageInput.setAttribute("title", "XHTML page image");
    imageInput.setAttribute("id", camelCaseStr(val));
    imageInput.value = sliceName(pageObj[pageId]['imagesScripts']['missing'][val]);
    imageInput.setAttribute("data-path", pageObj[pageId]['imagesScripts']['missing'][val]);
    td.append(imageInput);
    tr.appendChild(td);
    tbdy.append(tr);
  }
  tbl.append(tbdy);
}

function itemNum(type, arr){
  let count = 0;
  for (const key in arr) {
    if (key.includes(type)) count ++;
  }
  return count
}