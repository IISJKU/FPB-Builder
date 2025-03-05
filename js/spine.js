let pageDetails = {
  cover: {
    text: {},
    narration: {},
    imagesScripts: {
      Image: {},
    },
    alt: {},
  },
  credit: {
    text: {},
    narration: {},
    imagesScripts: {},
    alt: {},
  },
  menu: {
    text: {},
    narration: {},
    imagesScripts: {},
    alt: {},
  },
  1: {
    name: "page 1",
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
  let tempObj = "";

  if (tItem.length == 0 || tItem.attr("id") == "plusIcon" || tItem.attr("id") == "credit") {
    //[2] to insert the item after the menu page
    let child = $(this).closest("div").children()[2];
    let nextElem = child.nextElementSibling.id;
    let tempId = child.id;
    child.id = cItem.attr("id");
    cItem.attr("id", tempId);
    tempObj = pageDetailsObj[child.id];
    //pageDetailsObj[nextElem] = pageDetailsObj[cItem.attr("id")];
    pageDetailsObj[child.id] = pageDetailsObj[cItem.attr("id")];
    //pageDetailsObj[cItem.attr("id")] = tempObj;
    cItem.insertBefore(child);
  } else {
    let tempId = tItem.attr("id");
    tItem.attr("id", cItem.attr("id"));
    cItem.attr("id", tempId);
    tempObj = pageDetailsObj[tItem.attr("id")];
    pageDetailsObj[tItem.attr("id")] = pageDetailsObj[cItem.attr("id")];
    cItem.insertAfter(tItem);
  }
  pageDetailsObj[cItem.attr("id")] = tempObj;
  sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
  pageSorting();
  fillData();
});

// page orgnisation up arrow icon event
$(document).on("click", "#pageList .bi-arrow-up", function (e) {
  let cItem = $(this).closest("a");
  let tItem = cItem.prev("a");
  let tempObj = "";
  let pageDetailsObj = parseSessionData("pageDetails");
  if (tItem.length == 0 || tItem.attr("id") == "cover" || tItem.attr("id") == "menu") {
    let childrenLength = $(this).closest("div").children().length;
    //it should be -1 but -3 because of the plus list item and the credit page
    let child = $(this).closest("div").children()[childrenLength - 3];
    let tempId = child.id;
    child.id = cItem.attr("id");
    cItem.attr("id", tempId);
    tempObj = pageDetailsObj[child.id];
    pageDetailsObj[child.id] = pageDetailsObj[cItem.attr("id")];
    pageDetailsObj[cItem.attr("id")] = tempObj;
    cItem.insertAfter(child);
  } else {
    let tempId = cItem.attr("id");
    cItem.attr("id", tItem.attr("id"));
    tItem.attr("id", tempId);
    tempObj = pageDetailsObj[tItem.attr("id")];
    pageDetailsObj[tItem.attr("id")] = pageDetailsObj[cItem.attr("id")];
    cItem.insertBefore(tItem);
  }
  pageDetailsObj[cItem.attr("id")] = tempObj;
  sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
  pageSorting();
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
    $("#contentBox").find("#iframePreview").html("");
    $("#contentBox table").each(function () {
      $(this).find("tbody").html("");
    });
    let parsedDet = parseSessionData("pageDetails");
    delete parsedDet[elem];
    sessionStorage.setItem("pageDetails", JSON.stringify(parsedDet));
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

// browse button event for narrations audio
$(document).on("click", ".narrations", function (e) {
  let activeLang = $(this).closest("tr").children("th").text();
  let path = $(this).data("path");
  let elemId = $(this).attr("id");
  BRIDGE.narrations(path, elemId, activeLang);
});

// browse button event for the cover image
$(document).on("click", ".coverImage", function (e) {
  let actLang = $(this).closest("tr").children("th").text();
  let path = $(this).data("path");
  let elemId = $(this).attr("id");
  BRIDGE.coverImage(path, elemId, actLang);
});

// browse button event for the other files
$(document).on("click", ".otherFiles", function (e) {
  let path = $(this).data("path");
  let elemId = $(this).attr("id");
  BRIDGE.otherFiles(path, elemId);
});

window.BRIDGE.onSetPath((value, elemId) => {
  if (value["canceled"] == true) $("#" + elemId).val("");
  if (value["canceled"] == true || value["filePaths"].length == 0) return;
  let imgName = cutOutName(value["filePaths"][0]);
  $("#" + elemId).val(imgName);
  $("#" + elemId).attr("data-path", value["filePaths"][0]);
  if ($("#" + elemId).attr("data-missing") == 1) {
    $("#" + elemId)
      .get(0)
      .setCustomValidity("");
    $("#" + elemId).attr("data-missing", 0);
    // add the solved dependency to imagesScripts object and delete it from missing object
    elemKey = TranslateToEN(
      $("#" + elemId)
        .closest("tr")
        .children("th")
        .text()
    );
    if (elemKey.indexOf(" ") != -1 && elemKey.split(" ").length > 1) {
      let spElem = elemKey.split(" ");
      elemKey = TranslateToEN(spElem[0]) + " " + spElem[1];
    }
    let pageID = $("#pageList .list-group-item.active").attr("id");
    let parsedDet = parseSessionData("pageDetails");
    parsedDet[pageID]["imagesScripts"][elemKey] = value["filePaths"][0];
    delete parsedDet[pageID]["imagesScripts"]["missing"][elemKey];
    window.BRIDGE.importDependency2(value["filePaths"][0]);
    sessionStorage.setItem("pageDetails", JSON.stringify(parsedDet));
  }
});

// handle on image loaded event
window.BRIDGE.onImageLoaded((value) => {
  if (value["canceled"] == true) {
    $("#importImage").val("");
    $("#contentBox").find("#iframePreview").html("");
    deleteItem("imagesScripts", "Image");
  }
  if (value["canceled"] == true || value.length == 0) return;

  let imgName = cutOutName(value["imageFile"]);
  $("#importImage").val(imgName);
  $("#importImage").attr("data-path", value["imageFile"]);
  let pageID = $("#pageList .list-group-item.active").attr("id");
  let pageDetailsObj = parseSessionData("pageDetails");
  pageDetailsObj[pageID]["imagesScripts"]["Image"] = {};
  pageDetailsObj[pageID]["imagesScripts"]["Image"] = value["imageFile"];
  let lastIdx = value["imageFile"].lastIndexOf("\\") + 1;
  if (value["imageFile"].includes("/")) lastIdx = value["imageFile"].lastIndexOf("/") + 1;

  pageDetailsObj[pageID]["name"] = value["imageFile"].slice(lastIdx, value["imageFile"].indexOf("."));
  if (pageID != "cover" && pageID != "credit" && pageID != "menu") {
    if (pageDetailsObj[pageID].hasOwnProperty("name") && (pageDetailsObj[pageID]["name"] != "" || pageDetailsObj[pageID]["name"] != undefined)) {
      if (pageID != "menu") $("#pageList .list-group-item.active").text(pageDetailsObj[pageID]["name"]);
      //Create up and down icons to the element
      let pageElem = document.getElementById(pageID);
      createIcon(pageElem, "bi bi-arrow-up icons", translateTxt("Move the page up"));
      createIcon(pageElem, "bi bi-arrow-down icons", translateTxt("Move the page down"));
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
    }
    sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
    let table = $("#contentBox #imagesScripts table");
    createTableBody(table, pageID, "imagesScripts");
    if (value["missingFiles"]) addMissScripts(value["missingFiles"], pageID);
    addImageiframe(value["imageFile"], imgName);
  }
});

//cut out the name out of the path, depending on the system
function cutOutName(name) {
  if (name == "") return "";

  let lastIdx = name.lastIndexOf("\\") + 1;
  if (name.includes("/")) lastIdx = name.lastIndexOf("/") + 1;

  let pthLength = name.length;
  let imgName = name.slice(lastIdx, pthLength);

  return imgName;
}

// handle on narration loaded event
window.BRIDGE.onNarrationLoaded((value, elemId, activeLang) => {
  if (value["canceled"] == true) {
    $("#" + elemId).val("");
    deleteItem("narration", activeLang);
  }
  if (value["canceled"] == true || value["filePaths"].length == 0) return;
  let imgName = cutOutName(value["filePaths"][0]);
  $("#" + elemId).val(imgName);
  $("#" + elemId).attr("data-path", value["filePaths"][0]);
  let pageID = $("#pageList .list-group-item.active").attr("id");
  let pageDetailsObj = parseSessionData("pageDetails");
  pageDetailsObj[pageID].narration[activeLang] = value["filePaths"][0];
  sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
});

// handle on cover image loaded event
window.BRIDGE.onCoverLoaded((value, elemId, activeLang) => {
  if (value["canceled"] == true) {
    $("#" + elemId).val("");
    $("#contentBox").find("#iframePreview").html("");
    deleteItem("imagesScripts", "Image", activeLang);
  }
  if (value["canceled"] == true || value["filePaths"].length == 0) return;
  let imgName = cutOutName(value["filePaths"][0]);
  $("#" + elemId).val(imgName);
  $("#" + elemId).attr("data-path", value["filePaths"][0]);
  addImageiframe(value["filePaths"][0], imgName);
  let pageID = $("#pageList .list-group-item.active").attr("id");
  let pageDetailsObj = parseSessionData("pageDetails");
  pageDetailsObj[pageID]["imagesScripts"]["Image"] = {};
  pageDetailsObj[pageID]["imagesScripts"]["Image"][activeLang] = {};
  pageDetailsObj[pageID]["imagesScripts"]["Image"][activeLang] = value["filePaths"][0];
  sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
});

// delete current page sub Item
function deleteItem(mainItem, subItem, subSubItem) {
  let selectedPage = $("#pageList .list-group-item.active").attr("id");
  let delParsedDet = parseSessionData("pageDetails");
  delParsedDet[selectedPage][mainItem][subItem] = "";
  if (subSubItem != "" || subSubItem != undefined) {
    delete delParsedDet[selectedPage][mainItem][subItem][subSubItem];
  } else {
    delete delParsedDet[selectedPage][mainItem][subItem];
  }

  sessionStorage.setItem("pageDetails", JSON.stringify(delParsedDet));
}

// initialize spine page
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
  // -3 because of the menu, cover, credit and plus icon pages
  if (pageLength == "" || pageLength == undefined) pageLength = $("#pageList a").length - 3;
  aElem.setAttribute("href", "#");
  aElem.setAttribute("id", pageLength);
  aElem.setAttribute("class", "list-group-item list-group-item-action");
  let elemText = initPagesName(id, pageLength);
  aElem.appendChild(elemText);
  //Create up and down icons to the element
  createIcon(aElem, "bi bi-arrow-up icons", translateTxt("Move the page up"));
  createIcon(aElem, "bi bi-arrow-down icons", translateTxt("Move the page down"));
  //add new page before the credit page
  pages.insertBefore(aElem, creditPage);
  return pageLength;
}

//fill fields with the page details
function fillData() {
  let page = $("#pageList .list-group-item.active");
  let pageId = $("#pageList .list-group-item.active").attr("id");
  let pageLabel = document.getElementById("contentBoxLabel");
  pageLabel.innerText = translateTxt(page.text());
  if (pageId != "cover" && pageId != "credit" && pageId != "menu") {
    createIcon(pageLabel, "bi bi-trash3-fill icons", translateTxt("delete page"), "deletePage");
  }
  $("#contentBox").find("#iframePreview").html("");
  $("#contentBox table").each(function () {
    let table = $(this);
    let theadTxt = $(this).children("thead").children("tr").children("th");
    let section = theadTxt.attr("name");
    $(this).find("tbody").html("");
    if (section == "imagesScripts") clearBody(table, pageId, section);
    createTableBody(table, pageId, section);
  });
}

// handle clear data of the body of imagesScripts panel
function clearBody(tbl, pageID, sec) {
  tbdy = tbl.children("tbody");
  if (sec == "imagesScripts" && pageID == "cover") {
    return;
  }
  if (pageID == "credit") return;
  let pageDetObj = parseSessionData("pageDetails");
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.appendChild(document.createTextNode(translateTxt("Image")));
  th.setAttribute("scope", "row");
  th.setAttribute("class", "header");
  if (pageID == "cover") th.setAttribute("class", "header required");
  tr.setAttribute("tabindex", "0");
  tr.appendChild(th);
  let td = document.createElement("td");
  let imageInput = document.createElement("input");
  imageInput.setAttribute("type", "imageInput");
  imageInput.setAttribute("class", "form-control");
  imageInput.setAttribute("aria-label", translateTxt("Browse images and scripts button"));
  imageInput.setAttribute("placeholder", translateTxt("Browse"));
  if (pageDetObj.hasOwnProperty(pageID) && Object.keys(pageDetObj[pageID][sec]) != 0) {
    if (pageDetObj[pageID][sec].hasOwnProperty("Image") && pageDetObj[pageID][sec]["Image"] != undefined && pageDetObj[pageID][sec]["Image"] != "") {
      imageInput.value = pageDetObj[pageID][sec]["Image"];
    }
  }
  imageInput.setAttribute("id", "importImage");
  td.append(imageInput);
  tr.appendChild(td);
  tbdy.append(tr);
  tbl.append(tbdy);
}

//create body of the table based on the filled data
function createTableBody(tbl, pageId, section) {
  let tbdy = document.createElement("tbody");
  if (tbl.find("tbody").length > 0) {
    tbdy = tbl.children("tbody");
  }
  if (section == "text" || section == "alt" || section == "narration") {
    createLangRows(tbl, tbdy, pageId, section);
    return;
  }
  if (section == "imagesScripts" && pageId == "cover") {
    createLangsCover(tbl, tbdy, pageId, section);
    return;
  }
  let pageDetObj = parseSessionData("pageDetails");
  if (!pageDetObj[pageId] || !pageDetObj[pageId][section] || Object.keys(pageDetObj[pageId][section]) == 0) {
    pageDetObj[pageId] = emptyPage;
    newImagesScripts(pageId);
    return;
  }
  if (pageId == "credit") return;
  for (let val in pageDetObj[pageId][section]) {
    if (val == "missing") {
      missingDependencies(tbl, tbdy, pageId);
      continue;
    }
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    if (val.indexOf(" ") != -1 && val.split(" ").length > 1) {
      let spVal = val.split(" ");
      th.appendChild(document.createTextNode(translateTxt(spVal[0]) + " " + spVal[1]));
    } else {
      th.appendChild(document.createTextNode(translateTxt(val)));
    }
    th.setAttribute("scope", "row");
    th.setAttribute("class", "header");
    tr.setAttribute("tabindex", "0");
    tr.appendChild(th);
    let td = document.createElement("td");
    if (section == "imagesScripts") {
      if (val == "Image") {
        let importImg = document.getElementById("importImage");
        importImg.value = cutOutName(pageDetObj[pageId][section][val]);
        addImageiframe(pageDetObj[pageId][section][val], importImg.value);
        updatePageName(pageId, pageDetObj);
        continue;
      } else if (val != "Image") {
        let imageInput = document.createElement("input");
        imageInput.setAttribute("type", "imageInput");
        imageInput.setAttribute("aria-label", translateTxt("Browse scripts button"));
        imageInput.setAttribute("placeholder", translateTxt("Browse"));
        imageInput.value = cutOutName(pageDetObj[pageId][section][val]);
        imageInput.setAttribute("data-path", pageDetObj[pageId][section][val]);
        imageInput.setAttribute("id", camelCaseStr(val));
        imageInput.setAttribute("class", "form-control otherFiles");
        td.append(imageInput);
      }
    }
    tr.appendChild(td);
    tbdy.append(tr);
  }
  tbl.append(tbdy);
}

// Create selected languages rows in the tables
function createLangRows(tbl, tbdy, pageId, section) {
  if (
    (pageId == "menu" && (section == "narration" || section == "alt" || section == "text")) ||
    (pageId == "cover" && section == "text") ||
    (pageId == "credit" && (section == "narration" || section == "alt"))
  ) {
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
    if (section == "narration" && $("#audioNarr").is(":checked") == true) th.setAttribute("class", "reqNarrHeader required");
    tr.setAttribute("tabindex", "0");
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
      textElem.setAttribute("aria-label", langs[i] + " " + translateTxt("language image alt text"));
      textElem.setAttribute("class", "form-control");
      textElem.value = colVal;
      td.appendChild(textElem);
    } else if (section == "narration") {
      let narrInput = document.createElement("input");
      narrInput.setAttribute("type", "narrInput");
      narrInput.setAttribute("class", "form-control narrations");
      narrInput.setAttribute("aria-label", translateTxt("Browse narration button"));
      narrInput.setAttribute("placeholder", translateTxt("Browse"));
      narrInput.setAttribute("id", langs[i].toLowerCase() + "Narr");
      narrInput.value = cutOutName(colVal);
      narrInput.setAttribute("data-path", colVal);
      if ($("#audioNarr").is(":checked") == true) narrInput.required = true;
      td.append(narrInput);
    } else {
      textElem = document.createElement("textarea");
      textElem.setAttribute("class", "form-control");
      textElem.setAttribute("aria-label", langs[i] + " " + translateTxt("language text"));
      textElem.value = colVal;
      td.appendChild(textElem);
    }
    tr.appendChild(td);
    tbdy.append(tr);
  }
  tbl.append(tbdy);
}

// Create selected languages rows in the tables
function createLangsCover(tbl, tbdy, pageId, section) {
  let value = "";
  let colVal = "";
  let textElem = "";
  let langs = JSON.parse(sessionStorage.getItem("pubLang"));
  for (let i = 0; i < langs.length; i++) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(langs[i]));
    th.setAttribute("scope", "row");
    th.setAttribute("class", "header required");
    tr.setAttribute("tabindex", "0");
    tr.appendChild(th);
    let td = document.createElement("td");
    let pageDetObj = parseSessionData("pageDetails");
    if (pageDetObj.hasOwnProperty(pageId) && Object.keys(pageDetObj[pageId]).length > 0 && pageDetObj[pageId] && pageDetObj[pageId][section]) {
      value = pageDetObj[pageId][section]["Image"][langs[i]];
    }
    if (value != "" && value != undefined && value != "undefined") {
      colVal = value;
    }
    let imageInput = document.createElement("input");
    imageInput.setAttribute("type", "covInput");
    imageInput.setAttribute("class", "form-control coverImage");
    imageInput.setAttribute("aria-label", translateTxt("Browse cover image"));
    imageInput.setAttribute("placeholder", translateTxt("Browse"));
    imageInput.setAttribute("id", langs[i].toLowerCase() + "Cover");
    imageInput.value = cutOutName(colVal);
    addImageiframe(colVal, imageInput.value);
    imageInput.setAttribute("data-path", colVal);
    imageInput.required = true;
    td.append(imageInput);
    tr.appendChild(td);
    tbdy.append(tr);
  }
  tbl.append(tbdy);
}

// handle images and scripts panel for new pages
function newImagesScripts(pageID) {
  let imageInput = document.getElementById("importImage");
  if (pageID != "cover" && pageID != "credit" && document.getElementById("importImage") == undefined) {
    imageInput = document.getElementById("coverImage");
    imageInput.setAttribute("id", "importImage");
  }
}

function saveData() {
  let pageId = $("#pageList .list-group-item.active").attr("id");
  let pageDetObj = parseSessionData("pageDetails");
  $("#contentBox tbody tr").each(function () {
    let theadTxt = $(this).closest("table").children("thead").children("tr").children("th");
    let section = theadTxt.attr("name");
    let attr = TranslateToEN($(this).children("th").text());
    if (attr.indexOf(" ") != -1 && attr.split(" ").length > 1) {
      let spAttr = attr.split(" ");
      attr = TranslateToEN(spAttr[0]) + " " + spAttr[1];
    }
    if (pageDetObj[pageId] == undefined) {
      pageDetObj[pageId] = {};
    }
    if (pageDetObj[pageId][section] == undefined) {
      pageDetObj[pageId][section] = {};
    }
    missingAttr = $(this).children("td").children(0).attr("data-missing");
    //Change this later!
    if (section != "imagesScripts" && pageId != "cover") pageDetObj[pageId][section][attr] = $(this).children("td").children(0).val();
    if ((section == "narration" || section == "imagesScripts") && $(this).children("td").children(0).attr("data-path") != undefined) {
      if (missingAttr == "1") {
        if (pageDetObj[pageId][section]["missing"] == undefined) pageDetObj[pageId][section]["missing"] = {};
        pageDetObj[pageId][section]["missing"][attr] = $(this).children("td").children(0).attr("data-path");
      } else if (section == "imagesScripts" && pageId == "cover") {
        pageDetObj[pageId][section]["Image"][attr] = $(this).children("td").children(0).attr("data-path");
      } else {
        pageDetObj[pageId][section][attr] = $(this).children("td").children(0).attr("data-path");
      }
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

//after the user choose the xhtml image the page name and the page title in the content box
function updatePageName(pageID, detObj) {
  if (detObj == undefined) detObj = parseSessionData("pageDetails");
  if (pageID != "cover" && pageID != "credit" && pageID != "menu") {
    if (detObj[pageID].hasOwnProperty("name") && (detObj[pageID]["name"] != "" || detObj[pageID]["name"] != undefined)) {
      $("#pageList .list-group-item.active").text(detObj[pageID]["name"]);
      let pageLabel = document.getElementById("contentBoxLabel");
      pageLabel.innerText = detObj[pageID]["name"];
      createIcon(pageLabel, "bi bi-trash3-fill icons", translateTxt("delete page"), "deletePage");
      //Create up and down icons to the element
      let pageElem = document.getElementById(pageID);
      createIcon(pageElem, "bi bi-arrow-up icons", translateTxt("Move the page up"));
      createIcon(pageElem, "bi bi-arrow-down icons", translateTxt("Move the page down"));
    }
  }
}

//after the user choose the xhtml image the page name and the page title in the content box
function initPagesName(pageID, pagelength) {
  let detObj = parseSessionData("pageDetails");
  let pageText = "";
  if (pageID != "cover" && pageID != "credit" && pageID != "menu") {
    if (detObj.hasOwnProperty(pageID) && detObj[pageID].hasOwnProperty("name") && (detObj[pageID]["name"] != "" || detObj[pageID]["name"] != undefined)) {
      pageText = document.createTextNode(detObj[pageID]["name"]);
    } else {
      pageText = document.createTextNode(translateTxt("Page") + " " + pagelength);
    }
  }
  return pageText;
}

//sort the given array based on the element extension
function sortArr(arr) {
  let sortedArr = [];
  let jsArr = [];
  let cssArr = [];
  let audioArr = [];
  for (let x = 0; x < arr.length; x++) {
    if (arr[x].includes(".js")) {
      jsArr.push(arr[x]);
    } else if (arr[x].includes(".css")) {
      cssArr.push(arr[x]);
    } else if (arr[x].includes(".mp3" || ".wav")) {
      audioArr.push(arr[x]);
    }
  }
  sortedArr = jsArr.concat(cssArr).concat(audioArr);
  return sortedArr;
}

function addMissScripts(filesArr, pageID) {
  let newarr = sortArr(filesArr);
  let detObj = parseSessionData("pageDetails");
  detObj[pageID]["imagesScripts"]["missing"] = {};
  for (let i = 0; i < newarr.length; i++) {
    let tag = "";
    if (newarr[i].includes(".js")) tag = "Script";
    else if (newarr[i].includes(".mp3" || ".wav")) tag = "Audio";
    else if (newarr[i].includes(".css")) tag = "Style";
    let x = itemNum(tag, detObj[pageID]["imagesScripts"]) + 1;
    while (detObj[pageID]["imagesScripts"]["missing"][tag + " " + x] != undefined) {
      x = x + 1;
    }
    if (!Object.values(detObj[pageID]["imagesScripts"]["missing"]).includes(newarr[i])) detObj[pageID]["imagesScripts"]["missing"][tag + " " + x] = newarr[i];
  }
  sessionStorage.setItem("pageDetails", JSON.stringify(detObj));
  let table = $("#contentBox #imagesScripts table");
  let body = $("#contentBox #imagesScripts table tbody");
  missingDependencies(table, body, pageID);
}

//create missing dependencies body of the table based on the filled data
function missingDependencies(tbl, tbdy, pageId) {
  let pageObj = parseSessionData("pageDetails");
  for (let val in pageObj[pageId]["imagesScripts"]["missing"]) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    if (val.indexOf(" ") != -1 && val.split(" ").length > 1) {
      let spVal = val.split(" ");
      th.appendChild(document.createTextNode(translateTxt(spVal[0]) + " " + spVal[1]));
    } else {
      th.appendChild(document.createTextNode(translateTxt(val)));
    }
    th.setAttribute("scope", "row");
    th.setAttribute("class", "header");
    tr.setAttribute("tabindex", "0");
    tr.appendChild(th);
    let td = document.createElement("td");
    let imageInput = document.createElement("input");
    imageInput.setAttribute("type", "imageInput");
    imageInput.setAttribute("aria-label", translateTxt("Browse images and scripts button"));
    imageInput.setAttribute("class", "form-control otherFiles");
    imageInput.required = true;
    imageInput.setCustomValidity("Invalid");
    imageInput.setAttribute("data-missing", 1);
    imageInput.setAttribute("placeholder", translateTxt("Browse"));
    imageInput.setAttribute("id", camelCaseStr(val));
    imageInput.value = cutOutName(pageObj[pageId]["imagesScripts"]["missing"][val]);
    imageInput.setAttribute("data-path", pageObj[pageId]["imagesScripts"]["missing"][val]);
    td.append(imageInput);
    tr.appendChild(td);
    tbdy.append(tr);
  }
  tbl.append(tbdy);
}

function itemNum(type, arr) {
  let count = 0;
  for (const key in arr) {
    if (key.includes(type)) count++;
  }
  return count;
}

function pageSorting() {
  let dtailsObj = parseSessionData("pageDetails");
  let pagesArr = $("#pageList .list-group-item");
  let oldId;
  let oldObj = parseSessionData("pageDetails");
  // i = 2 to the counting after the menu page
  // pagesArr.length - 2 to exit when it reach to credit page
  for (let i = 2; i < pagesArr.length - 2; i++) {
    if (pagesArr[i].id == "credit") return;
    oldId = pagesArr[i].id;
    pagesArr[i].id = i - 1;
    dtailsObj[i - 1] = oldObj[oldId];
  }
  sessionStorage.setItem("pageDetails", JSON.stringify(dtailsObj));
}

// add ifram of the selected XHTML image
function addImageiframe(src, title) {
  $("#contentBox").find("#iframePreview").html("");
  let iframeDiv = document.getElementById("iframePreview");
  let iframeElem = document.createElement("iframe");
  iframeElem.setAttribute("src", src);
  iframeElem.setAttribute("title", title);
  iframeElem.setAttribute("id", "xhtmlIframe");
  iframeElem.setAttribute("onload", "onloadiframe()");
  iframeDiv.appendChild(iframeElem);
}

//handle iframe onload event
function onloadiframe() {
  $("#xhtmlIframe").contents().find("#monAudioPlay").attr("style", "display: none !important");
  $("#xhtmlIframe").contents().find(".svg-content").attr("style", "transform: scale(1.2); margin-top: 5%;");
  $("#xhtmlIframe").contents().find("img").attr("style", "margin-left: 35%; height: 97%;");
}
