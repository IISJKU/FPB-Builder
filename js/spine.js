let pageDetails = {
  cover: {
    text: {
      /*
      EN: "Little Red Riding Hood",
      IT: "Cappuccetto Rosso",*/
    },
    narration: {
      /*
      EN: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
      IT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",*/
    },
    imagesScripts: {
      /*
      Image: "C:\\Users\\ak127746\\Pictures\\1513-Rafael-SistineMadonna-Cherubs.jpg",
      Style: "",*/
    },
    alt: {
      /*
      EN: "Little Red Riding Hood Alt",
      IT: "Cappuccetto Rosso Alt",*/
    },
  },
  credit: {
    text: {
      /*EN:
        'Digital illustrated volume from the series <span lang="fr">Les Doigts Qui Rêvent</span> (France)\n' +
        "Validation: pagina EPUB-Checker version 2.0.6 and Ace by DAISY version 1.1.5\n" +
        'Digital volume "Ben wants a bat", an ePub3 version of the children\'s book <span lang="fr">"Émile veut une chauve-souris"</span> by <span lang="fr">Vincent Cuvellier</span> and <span lang="fr">Ronan Badel</span>, published by <span lang="fr">Gallimard</span>, France, adapted in text and illustration\n' +
        '<b class="ldqr-font-bold">Design and production of the adapted illustrations</b> by <span lang="fr">Yuvanoe</span> and <span lang="fr">Anaïs Brard</span> (<span lang="fr">Les Doigts Qui Rêvent</span>, France)\n',
      IT:
        'Volume digitale illustrato della collana <span lang="fr">Les Doigts Qui Rêvent</span> (Francia)\n' +
        "Convalida: pagina EPUB-Checker versione 2.0.6 e Ace by DAISY versione 1.1.5\n" +
        'Volume digitale "Ben wants a bat", versione ePub3 del libro per bambini <span lang="fr">"Émile veut une chauve-souris"</span> di <span lang="fr">Vincent Cuvellier</span> e <span lang="fr">Ronan Badel</span>, pubblicato da <span lang="fr">Gallimard</span>, Francia, adattato nel testo e nelle illustrazioni "Progetto e produzione di illustrazioni adattate".\n' +
        '<b class="ldqr-font-bold">Progettazione e realizzazione delle illustrazioni adattate</b> di <span lang="fr">Yuvanoe</span> e <span lang="fr">Anaïs Brard</span> (<span lang="fr">Les Doigts Qui Rêvent</span>, Francia)\n',
        */
    },
    narration: {},
    imagesScripts: {},
    alt: {},
  },
  /*1: {
    text: {
      EN: "Hello this is the Content of the first page.",
      IT: "Ciao, questo è il contenuto della prima pagina.",
      DE: "Hallo, das ist der Inhalt der ersten Seite.",
      FR: "Bonjour, voici le contenu de la première page.",
      LIT: "Sveiki, tai yra pirmojo puslapio turinys.",
    },
    narration: {
      EN: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
      IT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
      DE: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
      FR: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
      LIT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
    },
    imagesScripts: {
      Image: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page01-fig.xhtml",
    },
    altText: {
      EN: "This is the alt text for figure 1",
      IT: "Questo è il testo alternativo per la figura 1",
      DE: "Dies ist der Alternativtext für Abbildung 1",
      FR: "Ceci est le texte alternatif de la figure 1",
      LIT: "Tai yra 1 paveikslo alternatyvus tekstas",
    },
  },
  2: {
    text: {
      EN: "What might happen on the second page? I cant imagine...",
      IT: "Cosa potrebbe succedere nella seconda pagina? Non posso immaginare...",
      DE: "Was könnte auf der zweiten Seite passieren? Ich kann es mir nicht vorstellen...",
      FR: "Que pourrait-il se passer sur la deuxième page ? Je ne peux pas imaginer...",
      LIT: "Kas gali nutikti antrame puslapyje? Neįsivaizduoju...",
    },
    narration: {
      EN: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
      IT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
      DE: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
      FR: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
      LIT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
    },
    imagesScripts: {
      Image: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page02-fig.xhtml",
    },
    altText: {
      EN: "This is the alt text for figure 2",
      IT: "Questo è il testo alternativo per la figura 2",
      DE: "Dies ist der Alternativtext für Abbildung 2",
      FR: "Ceci est le texte alternatif de la figure 2",
      LIT: "Tai yra 2 paveikslo alternatyvus tekstas",
    },
  },*/
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
$(document).on("click", ".importImage", function (e) {
  let path = $(this).data('path');
  BRIDGE.importImage(path);
});

let activeLang = "";
// browse button event for narrations audio
$(document).on("click", ".narrations", function (e) {
  activeLang = $(this).closest("tr").children("th").text();
  let path = $(this).data('path');
  BRIDGE.narrations(path);
});

// browse button event for the cover image
$(document).on("click", "#coverImage", function (e) {
  let path = $(this).data('path');
  BRIDGE.coverImage(path);
});

// browse button event for the other files
$(document).on("click", ".otherFiles", function (e) {
  let path = $(this).data('path');
  BRIDGE.otherFiles(path);
});

window.BRIDGE.onSetPath((value) => {
  if (value['canceled'] == true) return; 
  let lastIdx = value['filePaths'][0].lastIndexOf("\\") + 1;
  let pthLength = value['filePaths'][0].length;
  let imgName = value['filePaths'][0].slice(lastIdx,pthLength);
  if (value.hasOwnProperty('type') && value['type'] == 'cover'){
    $("#coverImage").val(imgName);
    $("#coverImage").attr("data-path", value['filePaths'][0]);
  }else{
    $(".otherFiles").val(imgName);
    $(".otherFiles").attr("data-path", value['filePaths'][0]);
  }
});

window.BRIDGE.onImageLoaded((value) => {
  if (value['canceled'] == true) return; 
  let lastIdx = value['imageFile'].lastIndexOf("\\") + 1;
  let pthLength = value['imageFile'].length;
  let imgName = value['imageFile'].slice(lastIdx,pthLength);
  $(".importImage").val(imgName);
  $(".importImage").attr("data-path", value['imageFile']);
  let pageID = $("#pageList .list-group-item.active").attr("id");
  let pageDetailsObj = parseSessionData("pageDetails");
  pageDetailsObj[pageID]["name"] = value['imageFile'].slice(lastIdx,value['imageFile'].indexOf("."));
  if (pageID !='cover' && pageID != 'credit'){
    if (pageDetailsObj[pageID].hasOwnProperty("name") && (pageDetailsObj[pageID]["name"] !='' || pageDetailsObj[pageID]["name"] != undefined )){
      $("#pageList .list-group-item.active").text(pageDetailsObj[pageID]["name"])
        //Create up and down icons to the element
        let pageElem = document.getElementById(pageID);
        createIcon(pageElem, "bi bi-arrow-up icons", "Move the page up");
        createIcon(pageElem, "bi bi-arrow-down icons", "Move the page down");
    }
  }
  if (typeof pageDetailsObj[pageID] != undefined && pageDetailsObj[pageID] != undefined) {
    pageDetailsObj[pageID]["imagesScripts"]["Image"] = value["imageFile"];

    value["foundFiles"].forEach((element) => {
      let tag = "";

      if (element.includes(".js")) tag = "Script";
      else if (element.includes(".mp3" || ".wav")) tag = "Audio";
      else if (element.includes(".css")) tag = "Style";

      let x = 1;
      while (pageDetailsObj[pageID]["imagesScripts"][tag + " " + x] != undefined) {
        x = x + 1;
      }
      pageDetailsObj[pageID]["imagesScripts"][tag + " " + x] = element;
    });

    console.log(JSON.stringify(pageDetailsObj));
    sessionStorage.setItem("pageDetails", JSON.stringify(pageDetailsObj));
  }
});

window.BRIDGE.onNarrationLoaded((value) => {
  if (value['canceled'] == true) return; 
  let lastIdx = value[0].lastIndexOf("\\") + 1;
  let pthLength =value[0].length;
  let imgName = value[0].slice(lastIdx,pthLength);
  $(".narrations").val(imgName);
  $(".narrations").attr("data-path", value[0]);
  let pageID = $("#pageList .list-group-item.active").attr("id");
  let pageDetailsObj = parseSessionData("pageDetails");
  pageDetailsObj[pageID].narration[activeLang] = value[0];
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
  $("#contentBoxLabel").text(page.text());
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
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(val));
    th.setAttribute("scope", "row");
    th.setAttribute("class", "header");
    tr.appendChild(th);
    let td = document.createElement("td");
    //td.appendChild(document.createTextNode(pageDetObj[pageId][section][val]));
    if (section == "imagesScripts") {
      let imageInput = document.createElement("input");
      imageInput.setAttribute("type", "imageInput");
      imageInput.setAttribute("alt", "Browse images and scripts button");
      imageInput.setAttribute("placeholder", "Browse");
      imageInput.setAttribute("title", "XHTML page image");
      let imgPath = pageDetObj[pageId][section][val]
      let lastIdx = imgPath.lastIndexOf("\\") + 1;
      let pthLength =imgPath.length;
      let imgName = imgPath.slice(lastIdx,pthLength);
      imageInput.value = imgName;
      imageInput.setAttribute("data-path", imgPath);
      if (pageId == "cover" && val == "Image") {
        imageInput.setAttribute("class", "form-control");
        imageInput.setAttribute("id", "coverImage");
      } else if (val == "Image") {
        imageInput.setAttribute("class", "form-control importImage");
      } else if (val != "Image") {
        imageInput.setAttribute("class", "form-control otherFiles");
      }
      td.append(imageInput);
    }
    tr.appendChild(td);
    tbdy.appendChild(tr);
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
      //td.appendChild(document.createTextNode(colVal));
      let narrInput = document.createElement("input");
      narrInput.setAttribute("type", "narrInput");
      narrInput.setAttribute("class", "form-control narrations");
      narrInput.setAttribute("alt", "Browse narration button");
      narrInput.setAttribute("placeholder", "Browse");
      narrInput.setAttribute("title", "Browse xHTML image");
      let lastIdx = colVal.lastIndexOf("\\") + 1;
      let pthLength = colVal.length;
      let narrName = colVal.slice(lastIdx,pthLength);
      narrInput.value = narrName;
      narrInput.setAttribute("data-path", colVal);
      td.append(narrInput);
    } else {
      textElem = document.createElement("textarea");
      textElem.setAttribute("class", "form-control");
      textElem.value = colVal;
      td.appendChild(textElem);
    }
    tr.appendChild(td);
    tbdy.appendChild(tr);
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
  }else{
    imageInput.setAttribute("class", "form-control importImage");
  }
  imageInput.setAttribute("alt", "Browse images and scripts button");
  imageInput.setAttribute("placeholder", "Browse");
  imageInput.setAttribute("title", "Browse xHTML image");
  td.append(imageInput);
  tr.appendChild(td);
  tbdy.appendChild(tr);
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
