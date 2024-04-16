const frontendDataManager = new FrontendDataManager();

function changeContent(event, controlledTab) {
  let tabTitle = event.textContent.trim();
  let oldPage = $("#tabTitle").text();

  frontendDataManager.sendDataToBackend(oldPage);

  $("#tabTitle").text(tabTitle);

  if (tabTitle == "Metadata") {
    $("#publicationLanguage").trigger("change");
    if (metadataInitialized()) {
      loadInMetadata();
    } else {
      initializeMetadata();
    }
  }
  if (tabTitle == "Spine") {
    $("#publicationLanguage").trigger("change");
    fillData();
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
function createIcon(appendElem, iconClass, alt, elemId, modalID) {
  let icon = document.createElement("i");
  icon.setAttribute("class", iconClass);
  icon.setAttribute("alt", alt);
  if (elemId != "" && elemId != undefined) {
    icon.setAttribute("id", elemId);
  }
  if (modalID != null && modalID != "" && modalID != undefined && modalID != "undefined") {
    icon.setAttribute("data-bs-toggle", "modal");
    icon.setAttribute("data-bs-target", modalID);
  }
  appendElem.appendChild(icon);
}
