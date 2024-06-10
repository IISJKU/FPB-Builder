/**
 * LDQR JS Framework
 * Copyright © 2020 LDQR  All rights reserved.
 * @license LDQR
 *
 **/

/**
 * @constant
 * @type LDQR
 */
var ldqr = {};

ldqr.CHANGE_PAGE_CSS_SELECTOR = ".change-page";
ldqr.VITESSE_SON_VOIX = 1;
ldqr.VITESSE_DOUBLE_TAPE = 0.5;

/**
 *  Évènements start
 *  @constant
 *  @type Array
 */
ldqr.START_EVENT = ["touchstart", "mousedown"];
/**
 *  Évènement move
 *  @constant
 *  @type String
 */
ldqr.MOVE_EVENT = ["touchmove", "mousemove"];

/**
 *  Évènements end
 *  @constant
 *  @type Array
 */
ldqr.END_EVENT = ["touchend", "mouseup"];

// functions utiles
ldqr.Utils = {};

/**
 * Initialise
 * @date 24/03/2023 - 16:28:01
 * @class
 */

function ldqrBaseController() {
  this.initConfigurables();
  this.initComponents();
  this.appliqueLocalForage();
}

/**
 * Initialise la config
 */
ldqrBaseController.prototype.initConfigurables = function () {
  var monAudio = document.getElementById("player");
  if (monAudio) {
    // monAudio.playbackRate = 1.2;
    monAudio.pause();
  }

  // Touch SVG retire opacité si pas actif
  var mesSvg = document.querySelectorAll("svg");
  for (var i = 0; i !== mesSvg.length; i++) {
    var startEvent = ["touchstart", "mousedown"];
    for (var z = 0; z != startEvent.length; z++) {
      mesSvg[i].addEventListener(startEvent[z], function (e) {
        console.log("SVG touche");
        var mesopacity = document.querySelectorAll(".opacity1,.opacity02");
        for (k = 0; k !== mesopacity.length; k++) {
          mesopacity[k].classList.remove("opacity1");
          mesopacity[k].classList.remove("opacity02");
        }
        e.stopPropagation();
        e.preventDefault();
      });
    }
  }

  // Init LocalForage pour les sauvegardes
  ldqr.DATA_LOCAL_FORAGE = localforage.createInstance({
    name: "ldqr_emile_test",
  });
  // classe CSS pour les objets interactifs
  // ldqr.CONTROLE_ACTIF_CSS_SELECTOR = ".ldqr-actif,#fondImage";
  ldqr.CONTROLE_ACTIF_CSS_SELECTOR = ".ldqr-actif";
  // classe CSS pour les boutons de choix
  ldqr.CONTROLE_BOUTON_CSS_SELECTOR = ".svg-bouton,#boutonCouleur,#boutonBW,#boutonVersion";

  // Tap threshold value, in pixels
  ldqr.TAP_THRESHOLD = 200;

  // durée (en mms) qu'il faut pour faire apparaître le fenêtre de zoom
  ldqr.DELTA_TIME = 300;

  // div où se trouve le zoom (svg)
  ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR = ".zoomElt";

  // Options pour SVGPanZoom
  ldqr.ZOOM_OPTIONS = {
    // Zoom Params, set false to disable zoom

    initialViewBox: {
      x: 0, // the top-left corner X coordinate
      y: 0, // the top-left corner Y coordinate
      width: 748, // the width of the viewBox
      height: 1024, // the height of the viewBox
    },
    // Time(milliseconds) to use for animations. Set 0 to remove the animation
    limits: 50,
    animationTime: 250,
    zoom: {
      // Zoom Factor, viewBox values are multiplied or divided based on this factor to zoom on each step
      // Formula: ZoomOut => newWidth = width / (1 + factor), ZoomIn => newWidth = width * (1 + factor)
      factor: 0.25,
      // Zoom Limits
      // minZoom:0.1 => zoom out up to 0.1x
      minZoom: 1,
      // maxZoom:5 => zoom in upto 5x
      maxZoom: 50,
      // Event related flags
      callback: function (multiplier) {
        // console.log(multiplier);
      },
    },
  };

  ldqr.DEGRES_APERCU = ["version01", "version02", "version03", "version04", "version05"];
  ldqr.COULEURS_FOND_CSS_CLASS = [
    "ldqr-couleur-fond-blanc",
    "ldqr-couleur-fond-gris",
    "ldqr-couleur-fond-neg",
    "ldqr-couleur-fond-beige",
    "ldqr-couleur-fond-jaune",
  ];
  ldqr.TEXTE_SELECT = ["texteSeul", "imageSeule", "texteImage"];
  ldqr.TXT_BOUTON_TOGGLE_TEXTE = ["Image seule", "Texte et image"];

  // noms des classes CSS pour les noms de polices
  ldqr.FONT_CSS_CLASS = ["ldqr-font-luciole", "ldqr-font-verdana", "ldqr-font-arial-black", "ldqr-font-dys", "ldqr-font-arial"];

  // noms des classes CSS pour la taille de la police
  ldqr.FONT_SIZE_CSS_CLASS = ["ldqr-font-size-26", "ldqr-font-size-24", "ldqr-font-size-20"];

  // noms des classes CSS pour l'interlignage
  ldqr.FONT_INTERLIGNE_CSS_CLASS = ["ldqr-interligne-1", "ldqr-interligne-2", "ldqr-interligne-3"];

  // noms des classes CSS pour l'espacement des mots
  ldqr.FONT_SPACE_WORD_CSS_CLASS = ["ldqr-space-word-1", "ldqr-space-word-2", "ldqr-space-word-3"];
  // noms des classes CSS pour l'espacement des caractères
  ldqr.FONT_SPACE_CAR_CSS_CLASS = ["ldqr-space-car-1", "ldqr-space-car-2", "ldqr-space-car-3"];
  // noms des classes CSS pour l'espacement des lignes
  ldqr.FONT_SPACE_LINE_CSS_CLASS = ["ldqr-space-line-1", "ldqr-space-line-2", "ldqr-space-line-3"];
  ldqr.FONT_CASSE_CSS_CLASS = ["ldqr-font-majuscule", "ldqr-font-minuscule"];
  // Delay in milliseconds before deferred events fire
  ldqr.DEFERRED_EVENT_DELAY = 1000;
};

ldqrBaseController.prototype.initComponents = function () {
  this.boutonsChoix = new ldqrBoutonBaseController();
  this.boutonsSurprise = new ldqrBoutonBaseSurprise();
  this.svgAction = new ldqrSvgBaseController();
};

// Applique les valeurs LocalForage à la page
ldqrBaseController.prototype.appliqueLocalForage = function () {
  // ldqr.DATA_LOCAL_FORAGE.getItem("affiche-texte").then(function (d) {
  //   d = d || "afficherTexte";
  //   // ldqrLocalForage.initVersion();
  //   new affichageTexte(d);
  // });
  // ldqr.DATA_LOCAL_FORAGE.getItem("affiche-image").then(function (d) {
  //   d = d || "afficherImage";
  //   // ldqrLocalForage.initVersion();
  //   new affichageImage(d);
  // });
  // applique la font
  ldqr.DATA_LOCAL_FORAGE.getItem("font-name").then(function (d) {
    d = d || "choixLucioleBold";
    console.log(d);
    new choixFontName(d);
  });

  // applique la casse
  ldqr.DATA_LOCAL_FORAGE.getItem("font-casse").then(function (d) {
    d = d || "activerMinuscule";
    console.log(d);
    new activerMajuscule(d);
  });

  // // applique la taille de la police
  // ldqr.DATA_LOCAL_FORAGE.getItem("font-size").then(function (d) {
  //   d = d || ldqr.FONT_SIZE_CSS_CLASS[0];
  //   new choixFontSize(d);
  // });
  // // applique l'espacement des mots
  // ldqr.DATA_LOCAL_FORAGE.getItem("space-word").then(function (d) {
  //   d = d || ldqr.FONT_SPACE_WORD_CSS_CLASS[0];
  //   // new choixSpaceWord(d);
  // });
  // // applique l'espacement des caractères
  // ldqr.DATA_LOCAL_FORAGE.getItem("space-car").then(function (d) {
  //   d = d || ldqr.FONT_SPACE_CAR_CSS_CLASS[0];
  //   // new choixSpaceCar(d);
  // });
  // // applique l'espacement des lignes
  // ldqr.DATA_LOCAL_FORAGE.getItem("space-line").then(function (d) {
  //   d = d || ldqr.FONT_SPACE_LINE_CSS_CLASS[0];
  //   // new choixSpaceLine(d);
  // });
  // applique la couleur de fond
  ldqr.DATA_LOCAL_FORAGE.getItem("couleur-fond").then(function (d) {
    d = d || ldqr.COULEURS_FOND_CSS_CLASS[0];
    new choixCouleurFond(d);
  });
  // applique texte
  ldqr.DATA_LOCAL_FORAGE.getItem("texte-image").then(function (d) {
    d = d || "texteImage";
    // new choixTexteImage(d);
  });
  // applique les degrés
  // new versionImage();
  ldqr.DATA_LOCAL_FORAGE.getItem("def-image").then(function (d) {
    d = d || "version01";
    new choixVersionImage(d);
    new choixVersionImage00();
  });

  //applique noir et blanc
  ldqr.DATA_LOCAL_FORAGE.getItem("couleur-image").then(function (d) {
    d = d || "boutonCouleur";
    new choixCouleurImage(d);
    new choixVersionImage00();
  });
  ldqr.DATA_LOCAL_FORAGE.getItem("bouton-version-active").then(function (d) {
    d = d || "activerImageVersion";
    console.log(d);
    new activerDesactiverBoutonVersion(d);
  });
  ldqr.DATA_LOCAL_FORAGE.getItem("bouton-couleur-active").then(function (d) {
    d = d || "activerCouleurImage";
    console.log(d);
    new activerDesactiverBoutonCouleur(d);
  });
  ldqr.DATA_LOCAL_FORAGE.getItem("bouton-dys-active").then(function (d) {
    d = d || "desactiverDYS";
    console.log(d);
    new activerDesactiverBoutonDYS(d);
  });
  ldqr.DATA_LOCAL_FORAGE.getItem("bouton-audio-active").then(function (d) {
    d = d || "activerAudio";
    console.log(d);
    new activerDesactiverBoutonAudio(d);
  });
  ldqr.DATA_LOCAL_FORAGE.getItem("bouton-dys-choix").then(function (d) {
    d = d || [false, false, false, false];
    new activerDesactiverBoutonDYSchoix(d);
  });
  ldqr.DATA_LOCAL_FORAGE.getItem("vitesse-audio-voix").then(function (d) {
    d = d || 1;
    ldqr.VITESSE_SON_VOIX = d;
    var vitesseVal = document.getElementById("vitesseAudioVal");
    var txtVitesse = vitesseVal && vitesseVal.querySelector("text");
    txtVitesse && (txtVitesse.innerHTML = d);
  });
  // ldqr.DATA_LOCAL_FORAGE.getItem("vitesse-double-tape").then(function (d) {
  //   d = d || 0.5;
  //   console.log("dbleTape",d);
  //   ldqr.VITESSE_DOUBLE_TAPE= d;
  //   var vitesseVal = document.getElementById("dblTapeVal");
  //   var txtVitesse = vitesseVal && vitesseVal.querySelector("text");
  //   console.log(txtVitesse);
  //   txtVitesse && (txtVitesse.innerHTML = d);
  // });
};

/**
 * Initialise le svg (version)
 */
function initVersionImage() {
  var degre = ldqr.DEGRES_APERCU,
    degreLength = degre.length,
    i = 0;
  for (; i !== degreLength; i++) {
    var mesVersions = document.querySelectorAll("." + degre[i]),
      mesVersionsLength = mesVersions.length,
      j = 0;
    for (; j !== mesVersionsLength; j++) {
      mesVersions[j].classList.add("notDisplay");
    }
  }
  // var mesVersions = document.querySelectorAll(".version01"),
  //   mesVersionsLength = mesVersions.length,
  //   i;
  // for (i = 0; i !== mesVersionsLength; i++) {
  //   mesVersions[i].classList.remove("notDisplay");
  // }
}

/**
 *
 * Initialise les boutons qui ont la classe
 * ldqr.CONTROLE_BOUTON_CSS_SELECTOR
 *
 */
function ldqrBoutonBaseController() {
  var mesBoutons = document.querySelectorAll(ldqr.CONTROLE_BOUTON_CSS_SELECTOR),
    mbLength = mesBoutons.length,
    i = mbLength - 1;

  for (; i >= 0; i--) {
    new ldqrBoutonController(mesBoutons[i]);
  }
}

/**
 * appelé quand il y a un bouton
 *
 * @param {object} element
 */

function ldqrBoutonController(element) {
  this.el = element;
  for (var i = 0; i < ldqr.START_EVENT.length; i++) {
    this.el.addEventListener(ldqr.START_EVENT[i], this, false);
  }

  // pour a11y
  this.el.addEventListener("keydown", this, false);
}

/**
 *  On touch start, add an event listener for touch end. Store the
 *  touch start X, Y coordinates for later use.
 *
 *  @property {Object} event
 */
ldqrBoutonController.prototype.touchStart = function (event) {
  event.preventDefault();
  event.stopPropagation();
  switch (event.type) {
    case "mousedown":
    case "mouseup":
      this.startX = event.clientX;
      this.startY = event.clientY;
      break;
    case "touchstart":
    case "touchend":
      this.startX = event.changedTouches[0].clientX;
      this.startY = event.changedTouches[0].clientY;
      break;
    default:
      break;
  }
  // this.startX = ldqr.Utils.eventCanonicalX(event);
  // this.startY = ldqr.Utils.eventCanonicalY(event);
  // window.addEventListener(ldqr.END_EVENT, this, false);
  window.addEventListener("touchend", this, false);
  window.addEventListener("mouseup", this, false);
};

/**
 *  On touch end, remove our event listeners. Determine if the user action was a
 *  tap, or gesture; if the action was a tap then add <code>ldqr.ACTIVE_CSS_CLASS</code>
 *  to the body class and prevent default. Otherwise, allow ldqr to handle the event.
 *
 *  @property {Object} event The required event object
 */
var tapStart = 0;
var nbTouch = 0;
ldqrBoutonController.prototype.touchEnd = function (event) {
  // window.removeEventListener(ldqr.END_EVENT, this, false);
  window.removeEventListener("touchend", this, false);
  window.removeEventListener("mouseup", this, false);
  var valX = "";
  var valY = "";
  switch (event.type) {
    case "mousedown":
    case "mouseup":
      valX = event.clientX;
      valY = event.clientY;
      break;
    case "touchstart":
    case "touchend":
      valX = event.changedTouches[0].clientX;
      valY = event.changedTouches[0].clientY;
      break;
    default:
      break;
  }
  this.xTap = Math.abs(this.startX - valX) < ldqr.TAP_THRESHOLD;
  this.yTap = Math.abs(this.startY - valY) < ldqr.TAP_THRESHOLD;

  if (this.xTap && this.yTap) {
    event.preventDefault();
    event.stopPropagation();
    // if (this.el.getAttribute("id") === "dblTape")
    // {
    //    console.log("nbTouch", nbTouch);

    //    var currentTime = new Date().getTime();
    //    var tapLength = currentTime - tapStart;
    //    tapStart = currentTime;
    //    if (nbTouch === 1) {
    //      console.log("tapLength", tapLength);
    //      var vitesseVal = document.getElementById("dblTapeVal");
    //      vitesseVal.querySelector("text").innerHTML=(tapLength/1000).toFixed(2);
    //      ldqr.VITESSE_DOUBLE_TAPE = vitesseVal;
    //      vitesseVal.classList.add("checked");
    //      nbTouch = 0;
    //      tapStart = 0;
    //    }else{
    //      nbTouch++;
    //    }

    // }
    this.setLocalForage();
  }
};

// Ajoute data dans localForage
ldqrBoutonController.prototype.setLocalForage = function (event) {
  var elt = this.el;
  var eltId = elt.getAttribute("id");
  var ldqrBoutonController = this;
  var monAudioPage0 = document.getElementById("monTexteAudio");
  console.log(elt);
  if (elt.classList.contains("bouton-choix-police")) {
    new choixFontName(eltId);
    // ldqr.DATA_LOCAL_FORAGE.setItem("font-name", eltId).then(function (d) {
    // // new choixFontName(d);
    //   // ldqrBoutonController.setPositionTriangleBulle();
    // });
  } else if (elt.classList.contains("font-size")) {
    ldqr.DATA_LOCAL_FORAGE.setItem("font-size", eltId).then(function (d) {
      // new choixFontSize(d);
      // ldqrBoutonController.setPositionTriangleBulle();
    });
  } else if (elt.classList.contains("space-word")) {
    ldqr.DATA_LOCAL_FORAGE.setItem("space-word", eltId).then(function (d) {
      // new choixSpaceWord(d);
      // ldqrBoutonController.setPositionTriangleBulle();
    });
  } else if (elt.classList.contains("space-car")) {
    ldqr.DATA_LOCAL_FORAGE.setItem("space-car", eltId).then(function (d) {
      // new choixSpaceCar(d);
      // ldqrBoutonController.setPositionTriangleBulle();
    });
  } else if (elt.classList.contains("space-line")) {
    ldqr.DATA_LOCAL_FORAGE.setItem("space-line", eltId).then(function (d) {
      // new choixSpaceLine(d);
      // ldqrBoutonController.setPositionTriangleBulle();
    });
  } else if (elt.classList.contains("couleur-fond")) {
    new choixCouleurFond(eltId);

    // ldqr.DATA_LOCAL_FORAGE.setItem("couleur-fond", eltId).then(function (d) {
    //   new choixCouleurFond(d);
    // });
  } else if (elt.classList.contains("texte-image")) {
    ldqr.DATA_LOCAL_FORAGE.setItem("texte-image", eltId).then(function (d) {
      // ldqrLocalForage.initVersion();
      // new choixTexteImage(d);
    });
  } else if (elt.classList.contains("couleur-image")) {
    new choixCouleurImage(eltId);
    choixVersionImage00();

    // ldqr.DATA_LOCAL_FORAGE.setItem("couleur-image", eltId).then(function (d) {
    //   // ldqrLocalForage.initVersion();
    //   new choixCouleurImage(d);
    // });
  } else if (elt.classList.contains("def-image")) {
    new choixVersionImage(eltId);
    choixVersionImage00();
    // ldqr.DATA_LOCAL_FORAGE.setItem("def-image", eltId).then(function (d) {

    // });
  } else if (elt.classList.contains("affiche-texte")) {
    ldqr.DATA_LOCAL_FORAGE.setItem("affiche-texte", eltId).then(function (d) {
      // new choixFontSize(d);
      // ldqrBoutonController.setPositionTriangleBulle();
      new affichageTexte(d);
    });
  } else if (elt.classList.contains("affiche-image")) {
    ldqr.DATA_LOCAL_FORAGE.setItem("affiche-image", eltId).then(function (d) {
      // new choixFontSize(d);
      // ldqrBoutonController.setPositionTriangleBulle();
      new affichageImage(d);
    });
  } else if (eltId === "boutonBW" || eltId === "boutonCouleur") {
    new choixCouleurImage(eltId);
    new choixVersionImage00();
    // ldqr.DATA_LOCAL_FORAGE.setItem("couleur-image", eltId).then(function (d) {
    //   // ldqrLocalForage.initVersion();

    // });
  } else if (eltId === "boutonVersion") {
    var menuBas = document.getElementById("menuBas");
    var allVersion = document.getElementById("boutonsAllVersion");
    if (menuBas.classList.contains("haut")) {
      menuBas.classList.remove("haut");
      menuBas.classList.add("bas");
      allVersion.classList.remove("displayInLine");
      allVersion.classList.add("notDisplay");
    } else {
      menuBas.classList.remove("bas");
      menuBas.classList.add("haut");
      allVersion.classList.remove("notDisplay");
      allVersion.classList.add("displayInLine");
    }
  } else if (elt.classList.contains("bouton-version-active")) {
    new activerDesactiverBoutonVersion(eltId);

    // ldqr.DATA_LOCAL_FORAGE.setItem("bouton-version-active", eltId).then(function (d) {
    //   new activerDesactiverBoutonVersion(eltId);
    // });
  } else if (eltId === "activerMajuscule" || eltId === "activerMinuscule") {
    new activerMajuscule(eltId);
    // ldqr.DATA_LOCAL_FORAGE.setItem("bouton-dys-active", eltId).then(function (d) {
    //   new activerDesactiverBoutonDYS(eltId);
    // });
  } else if (eltId === "desactiverCouleurImage" || eltId === "activerCouleurImage") {
    new activerDesactiverBoutonCouleur(eltId);
    // ldqr.DATA_LOCAL_FORAGE.setItem("bouton-couleur-active", eltId).then(function (d) {
    //   new activerDesactiverBoutonCouleur(eltId);
    // });
  } else if (eltId === "desactiverDYS" || eltId === "activerDYS") {
    new activerDesactiverBoutonDYS(eltId);
    // ldqr.DATA_LOCAL_FORAGE.setItem("bouton-dys-active", eltId).then(function (d) {
    //   new activerDesactiverBoutonDYS(eltId);
    // });
  } else if (eltId === "audioPlus" || eltId === "audioMoins") {
    if (eltId === "audioPlus") {
      ldqr.VITESSE_SON_VOIX = ldqr.VITESSE_SON_VOIX + 0.2;
    } else {
      ldqr.VITESSE_SON_VOIX = ldqr.VITESSE_SON_VOIX - 0.2;
    }
    if (ldqr.VITESSE_SON_VOIX < 0.2) {
      ldqr.VITESSE_SON_VOIX = 0.2;
    }
    if (ldqr.VITESSE_SON_VOIX > 4) {
      ldqr.VITESSE_SON_VOIX = 4;
    }

    ldqr.DATA_LOCAL_FORAGE.setItem("vitesse-audio-voix", Math.round(ldqr.VITESSE_SON_VOIX * 100) / 100).then(function (d) {
      var vitesseVal = document.getElementById("vitesseAudioVal").querySelector("text");
      vitesseVal.innerHTML = d;
      monAudioPage0.currentTime = 0;
      monAudioPage0.playbackRate = d;
      monAudioPage0.play();
    });
  } else if (eltId === "desactiverAudio" || eltId === "activerAudio") {
    ldqr.DATA_LOCAL_FORAGE.setItem("bouton-audio-active", eltId).then(function (d) {
      new activerDesactiverBoutonAudio(eltId);
    });
  } else if (eltId === "gras" || eltId === "italique" || eltId === "souligne" || eltId === "muet") {
    console.log(eltId);
    if (elt.classList.contains("checked")) {
      elt.classList.add("unchecked");
      elt.classList.remove("checked");
    } else {
      elt.classList.add("checked");
      elt.classList.remove("unchecked");
    }
    var val = returnTabChoix(".bouton-dys-choix");
    new activerDesactiverBoutonDYSchoix(val);
    // ldqr.DATA_LOCAL_FORAGE.setItem("bouton-dys-choix", val).then(function (d) {
    //   d = d || [false, false, false, false];
    //   new activerDesactiverBoutonDYSchoix(d);
    // });
  } else if (elt.classList.contains("pa-menu-bouton")) {
    new affichagePageMenu(eltId);
  }
};

/**
 *  Trie Event
 */
ldqrBoutonController.prototype.handleEvent = function (event) {
  event.stopPropagation();
  event.preventDefault();
  console.log(event);

  switch (event.type) {
    case "mousedown":
    case "touchstart":
      // ldqr.START_EVENT = event.type;
      this.touchStart(event);
      break;
    case "mouseup":
    case "touchend":
      // ldqr.END_EVENT = event.type;
      this.touchEnd(event);
      break;
    case "keydown":
      console.log(event.code);
      break;
  }
};

/**
 * Initialise les SVG actif
 *
 */
function ldqrSvgBaseController() {
  var zoomEltDiv = document.querySelector(ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR);
  // new initVersionImage();
  zoomEltDiv && this.initSvgPanZoom();
  zoomEltDiv && this.initCloseButton();
  var mesSvg = document.querySelectorAll(ldqr.CONTROLE_ACTIF_CSS_SELECTOR),
    mbLength = mesSvg.length,
    i = mbLength - 1;
  for (; i >= 0; i--) {
    new ldqrSvgController(mesSvg[i], this.SVGPanZoom);
  }
}

// initialise SVGPAnZoom
ldqrSvgBaseController.prototype.initSvgPanZoom = function () {
  var svgPanZoom = {},
    zoomEltDiv = document.querySelector(ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR);

  var zoomElt = zoomEltDiv.querySelector("svg");
  svgPanZoom.panZoom = new SVGPanZoom(zoomElt, ldqr.ZOOM_OPTIONS);
  svgPanZoom.zoomElt = zoomElt;
  svgPanZoom.zoomEltDiv = zoomEltDiv;
  this.SVGPanZoom = svgPanZoom;
};
ldqrSvgBaseController.prototype.initCloseButton = function (event) {
  var zoomEltDiv = this.SVGPanZoom.zoomEltDiv,
    zoomElt = this.SVGPanZoom.zoomElt,
    closeButton = zoomEltDiv.querySelector(".close-bouton");
  if (closeButton) {
    var startEvent = ["touchstart", "mousedown"];
    for (var z = 0; z != startEvent.length; z++) {
      closeButton.addEventListener(startEvent[z], function (event) {
        event.stopPropagation();
        event.preventDefault();
        zoomElt.innerHTML = "";
        zoomEltDiv.classList.add("notDisplay");
      });
    }
  }
};

/**
 * appelé quand il y a un Svg sollicité
 *
 * @param {object} element
 * @param {object} element - objet SVGPanZoom
 */

function ldqrSvgController(element, svgPanZoom) {
  this.el = element;
  this.SVGPanZoom = svgPanZoom;
  // this.el.addEventListener(ldqr.START_EVENT, this, false);
  element.addEventListener(
    "mousemove",
    function (e) {
      e.preventDefault();
    },
    false
  );
  element.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    false
  );

  this.el.addEventListener("mousedown", this, false);
  this.el.addEventListener("mouseup", this, false);
  this.el.addEventListener("touchstart", this, false);
  this.el.addEventListener("touchend", this, false);
}

/**
 *  On touch start, add an event listener for touch end. Store the
 *  touch start X, Y coordinates for later use.
 *
 *  @property {Object} event
 */
var lastTap = 0;

ldqrSvgController.prototype.touchStart = function (event) {
  event.preventDefault();
  var SvgPanZoom = this.SVGPanZoom;
  var elt = this.el;
  this.timeout;
  console.log("start", elt);
  console.log(event);
  if (elt.getAttribute("id") === "groupeImage" || elt.getAttribute("id") === "fondImage") {
    var mesopacity = document.querySelectorAll(".opacity1,.opacity02");
    for (i = 0; i !== mesopacity.length; i++) {
      mesopacity[i].classList.remove("opacity1");
      mesopacity[i].classList.remove("opacity02");
    }
    return;
  }
  switch (event.type) {
    case "mousedown":
    case "mouseup":
      this.startX = event.clientX;
      this.startY = event.clientY;
      break;
    case "touchstart":
    case "touchend":
      this.startX = event.changedTouches[0].clientX;
      this.startY = event.changedTouches[0].clientY;
      break;
    default:
      break;
  }
  // this.startX = ldqr.Utils.eventCanonicalX(event);
  // this.startY = ldqr.Utils.eventCanonicalY(event);
  // window.addEventListener(ldqr.END_EVENT, this, false);
  window.addEventListener("mouseup", this, false);
  window.addEventListener("touchend", this, false);

  this.monTimeOut = setTimeout(function () {
    new ldqrZoomElement(elt, SvgPanZoom);
  }, 1000);
};

/**
 *  On touch end, remove our event listeners. Determine if the user action was a
 *  tap, or gesture; if the action was a tap then add <code>ldqr.ACTIVE_CSS_CLASS</code>
 *  to the body class and prevent default. Otherwise, allow ldqr to handle the event.
 *
 *  @property {Object} event The required event object
 */
ldqrSvgController.prototype.touchEnd = function (event) {
  var elt = this.el;
  var SvgPanZoom = this.SVGPanZoom;
  var timeout = this.timeout;
  var currentTime = new Date().getTime();
  var tapLength = currentTime - this.lastTap;
  event.stopPropagation();
  event.preventDefault();
  clearTimeout(timeout);
  if (tapLength < 600 && tapLength > 0) {
    new ldqrZoomElement(elt, SvgPanZoom);
    console.log("double click");
  } else {
    console.log("simple click");

    timeout = setTimeout(function () {
      //Single Tap/Click code here

      clearTimeout(timeout);
    }, 500);
  }
  this.lastTap = currentTime;
  console.log("fin", elt);

  // window.removeEventListener(ldqr.END_EVENT, this, false);
  window.removeEventListener("mouseup", this, false);
  window.removeEventListener("touchend", this, false);
  clearTimeout(this.monTimeOut);
  var zoomEltDiv = document.querySelector(ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR);
  if (zoomEltDiv.classList.contains("notDisplay")) {
    var valX = "";
    var valY = "";
    switch (event.type) {
      case "mousedown":
      case "mouseup":
        valX = event.clientX;
        valY = event.clientY;
        break;
      case "touchstart":
      case "touchend":
        valX = event.changedTouches[0].clientX;
        valY = event.changedTouches[0].clientY;
        break;
      default:
        break;
    }
    this.xTap = Math.abs(this.startX - valX) < ldqr.TAP_THRESHOLD;
    this.yTap = Math.abs(this.startY - valY) < ldqr.TAP_THRESHOLD;
    console.log(elt);
    if (this.xTap && this.yTap) {
      event.stopPropagation();
      event.preventDefault();
      new ldrqOpacityElement(elt);
    }
  }
};

/**
 *  Trie Event
 */
ldqrSvgController.prototype.handleEvent = function (event) {
  event.stopPropagation();
  event.preventDefault();
  console.log("handleEvent", event.type);
  switch (event.type) {
    case "mousedown":
    case "touchstart":
      this.touchStart(event);
      break;
    case "mouseup":
    case "touchend":
      this.touchEnd(event);
      break;
    case "keydown":
      console.log(event.code);
      break;
  }
};

/**
 *
 * Initialise les boutons qui ont la classe
 * ldqr.CONTROLE_BOUTON_CSS_SELECTOR
 *
 */
function ldqrBoutonBaseSurprise() {
  var mesBoutons = document.querySelectorAll(".bouton-surprise"),
    mbLength = mesBoutons.length,
    i = mbLength - 1;

  for (; i >= 0; i--) {
    new ldqrBoutonSurprise(mesBoutons[i]);
  }
}

/**
 * appelé quand il y a un bouton
 *
 * @param {object} element
 */

function ldqrBoutonSurprise(element) {
  this.el = element;
  this.el.style.cursor = "pointer";
  // this.el.addEventListener(ldqr.START_EVENT, this, false);
  this.el.addEventListener("mousedown", this, false);
  this.el.addEventListener("mouseup", this, false);
  this.el.addEventListener("touchstart", this, false);
  this.el.addEventListener("touchend", this, false);
  // pour a11y
  this.el.addEventListener("keydown", this, false);
}

/**
 *  On touch start, add an event listener for touch end. Store the
 *  touch start X, Y coordinates for later use.
 *
 *  @property {Object} event
 */
ldqrBoutonSurprise.prototype.touchStart = function (event) {
  event.stopPropagation();
  event.preventDefault();

  // console.log(this.el);
  switch (event.type) {
    case "mousedown":
    case "mouseup":
      this.startX = event.clientX;
      this.startY = event.clientY;
      break;
    case "touchstart":
    case "touchend":
      this.startX = event.changedTouches[0].clientX;
      this.startY = event.changedTouches[0].clientY;
      break;
    default:
      break;
  }
  // this.startX = ldqr.Utils.eventCanonicalX(event);
  // this.startY = ldqr.Utils.eventCanonicalY(event);
  // window.addEventListener(ldqr.END_EVENT, this, false);
  window.addEventListener("mouseup", this, false);
  window.addEventListener("touchend", this, false);
};

/**
 *  On touch end, remove our event listeners. Determine if the user action was a
 *  tap, or gesture; if the action was a tap then add <code>ldqr.ACTIVE_CSS_CLASS</code>
 *  to the body class and prevent default. Otherwise, allow ldqr to handle the event.
 *
 *  @property {Object} event The required event object
 */
ldqrBoutonSurprise.prototype.touchEnd = function (event) {
  event.stopPropagation();
  event.preventDefault();
  // window.removeEventListener(ldqr.END_EVENT, this, false);
  window.removeEventListener("mouseup", this, false);
  window.removeEventListener("touchend", this, false);
  var valX = "";
  var valY = "";
  switch (event.type) {
    case "mousedown":
    case "mouseup":
      valX = event.clientX;
      valY = event.clientY;
      break;
    case "touchstart":
    case "touchend":
      valX = event.changedTouches[0].clientX;
      valY = event.changedTouches[0].clientY;
      break;
    default:
      break;
  }
  this.xTap = Math.abs(this.startX - valX) < ldqr.TAP_THRESHOLD;
  this.yTap = Math.abs(this.startY - valY) < ldqr.TAP_THRESHOLD;

  if (this.xTap && this.yTap) {
    event.stopPropagation();
    event.preventDefault();

    this.setAction();
  }
};

/**
 *  Trie Event
 */
ldqrBoutonSurprise.prototype.handleEvent = function (event) {
  event.stopPropagation();
  event.preventDefault();
  console.log(event.type);
  switch (event.type) {
    case "mousedown":
    case "touchstart":
      this.touchStart(event);
      break;
    case "mouseup":
    case "touchend":
      this.touchEnd(event);
      break;
    case "keydown":
      console.log(event.code);
      break;
  }
};

ldqrBoutonSurprise.prototype.setAction = function (event) {
  var element = this.el;
  console.log("setaAction " + this.el.getAttribute("id"));
  var monId = element.getAttribute("id");
  var maPage = document.querySelector("title").getAttribute("id");
  var sonOff = document.getElementById("sonOff");

  var monAnim = document.querySelector("#anime01");
  var monAnimFin = document.querySelector("#animeFin");
  var menuBas = document.getElementById("menuBas");
  var monAudio = document.getElementById("monTexteAudio");
  var boutonPause = document.getElementById("pauseAudio");
  monAudio &&
    monAudio.addEventListener("ended", function () {
      boutonPause.classList.add("notDisplay");
    });
  if (monId === "playAudio" || monId === "playTexteSr") {
    boutonPause.classList.remove("notDisplay");
    monAudio.playbackRate = ldqr.VITESSE_SON_VOIX;
    monAudio.play();
  } else if (monId === "pauseAudio") {
    boutonPause.classList.add("notDisplay");
    monAudio.pause();
  } else if (monId === "btnOnOff2") {
    if (maPage === "p09fig") {
      console.log(maPage);
      setTimeout(function () {
        menuBas.classList.remove("notDisplay");
      }, 5500);
    }

    monAnimFin &&
      monAnimFin.addEventListener(
        "endEvent",
        function () {
          menuBas.classList.remove("notDisplay");
        },
        false
      );
    var mesSonsAnimations = document.querySelectorAll(".son-animation");
    mesSonsAnimations.forEach((s) => {
      var id = s.getAttribute("id");
      var splitSon = id.split("-");
      if (splitSon.length > 1) {
        if (splitSon[1] === "1") {
          s.currentTime = 0;
          s.play();
        }
      } else {
        s.currentTime = 0;
        s.play();
      }
    });
    if (maPage === "p12fig") {
      var nuitJour = document.querySelectorAll(".jour-nuit");
      for (var i = 0; i < nuitJour.length; i++) {
        nuitJour[i].classList.toggle("notDisplay");
      }
      return;
    }
    menuBas.classList.add("notDisplay");

    // switch (maPage) {
    //     case "p13fig":
    //         // var monEmile = document.getElementById("imageEntiere");
    //         // var maSouris = document.getElementById("imageSouris");
    //         // var souris = document.getElementById("Souris");
    //         // monEmile.classList.remove("moveLeftEmile");
    //         // maSouris.classList.remove("moveLeftEmile");
    //         // monEmile.classList.add("moveRightEmile");
    //         // maSouris.classList.add("moveRightEmile");

    //         // // monEmile.classList.remove("moveRightEmile");
    //         // // maSouris.classList.remove("moveRightEmile");
    //         // monEmile.classList.add("moveLeftEmile");
    //         // maSouris.classList.add("moveLeftEmile");
    //         // souris.classList.add("tremblementSouris");
    //         // setTimeout(function () {
    //         //     //   monEmile.classList.remove("moveLeftEmile");
    //         //     //   monEmile.classList.add("moveRightEmile");
    //         //     //   maSouris.classList.remove("moveLeftEmile");
    //         //     //   maSouris.classList.add("moveRightEmile");
    //         //     souris.classList.remove("tremblementSouris");

    //         // }, 3000);
    //         // break;

    //     default:
    //         break;
    // }
    monAnim && monAnim.beginElement();
  } else if (monId === "arrow_right") {
    console.log("on tourne la page à droite");
  } else if (monId === "arrow_left") {
    console.log(maPage);
    // window.location.href="page03-txt.xhtml";
  } else {
    if (sonOff.style.display !== "none") {
      sonOff.style.display = "none";
      switch (maPage) {
        case "page09":
        case "page07":
          ldqr.SON_GROTTE.currentTime = 0;
          ldqr.SON_GROTTE.play();
          break;
        case "page14":
          ldqr.SON_SOURIS.loop = true;
          ldqr.SON_SOURIS.play();
          break;

        default:
          break;
      }
    } else {
      sonOff.style.display = "inline";
      switch (maPage) {
        case "page09":
        case "page07":
          //  ldqr.SON_GROTTE.currentTime = 0;
          ldqr.SON_GROTTE.pause();
          break;
        case "page14":
          //  ldqr.SON_GROTTE.currentTime = 0;
          ldqr.SON_SOURIS.pause();
          break;

        default:
          break;
      }
    }
  }
};

function ldrqOpacityElement(el) {
  var parent = el.parentElement;
  var enfants = parent.children;
  var i;
  if (el.classList.contains("opacity1")) {
    for (i = 0; i !== enfants.length; i++) {
      enfants[i].classList.remove("opacity1");
      enfants[i].classList.remove("opacity02");
    }
  } else if (el.classList.contains("opacity02")) {
    for (i = 0; i !== enfants.length; i++) {
      enfants[i].classList.remove("opacity1");
      enfants[i].classList.add("opacity02");
    }
    el.classList.add("opacity1");
  } else {
    for (i = 0; i !== enfants.length; i++) {
      enfants[i].classList.remove("opacity1");
      enfants[i] !== el && enfants[i].classList.add("opacity02");
    }
    el.classList.add("opacity1");
  }
}

function ldqrZoomElement(el, SVGPanZoom) {
  var svgBox = ldqr.ZOOM_OPTIONS.initialViewBox;
  SVGPanZoom.panZoom.reset();
  var zoomElt = SVGPanZoom.zoomElt;
  var newEl = el.cloneNode(true);
  var zoomEltDiv = document.querySelector(ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR);
  newEl.classList.remove("opacity02");
  newEl.classList.remove("opacity1");
  newEl.classList.remove("ldqr-actif");
  zoomEltDiv.classList.remove("notDisplay");

  zoomElt.appendChild(newEl);

  zoomElt.classList.remove("notDisplay");
  var bbox = el.getBBox();
  if (bbox.x > svgBox.width) {
    bbox.x -= svgBox.width;
  }
  if (bbox.y > svgBox.height) {
    bbox.y -= svgBox.height;
  }
  console.log(svgBox, bbox);

  SVGPanZoom.panZoom.setViewBox(bbox.x, bbox.y, bbox.width, bbox.height);

  // var bbox = el.dataset.bbox.split(',');
  // SVGPanZoom.panZoom.setViewBox(bbox[0], bbox[1], bbox[2], bbox[3]);
}

function choixFontName(d) {
  var texte = document.querySelectorAll("#monTexte,text");
  if (!texte) return;
  var elt = document.getElementById(d);
  var className = "";
  var bold = false;
  switch (d) {
    case "choixLuciole":
      className = "ldqr-font-luciole";
      break;
    case "choixLucioleBold":
      className = "ldqr-font-luciole";
      bold = true;
      break;
    case "choixArialBlack":
      className = "ldqr-font-arial-black";
      break;
    case "choixOpenDys":
      className = "ldqr-font-dys";
      break;
    case "choixVerdana":
      className = "ldqr-font-verdana";
      break;
    case "choixVerdanaBold":
      className = "ldqr-font-verdana";
      bold = true;
      break;

    default:
      break;
  }
  new appliqueChecked(elt, ".bouton-choix-police");
  // new removeClassNameAll(document.body, ldqr.FONT_CSS_CLASS);
  for (var i = 0; i !== texte.length; i++) {
    if (!texte[i].parentElement.classList.contains("bouton-choix-police")) {
      new removeClassNameAll(texte[i], ldqr.FONT_CSS_CLASS);
      texte[i].classList.remove("ldqr-font-bold");

      if (bold) texte[i].classList.add("ldqr-font-bold");
      // document.body.classList.add(className);
      texte[i].classList.add(className);
    }
  }
}
// function choixFontSize(d) {
//   console.log(d);
//   var elt = document.getElementById(d);
//   new appliqueChecked(elt, ".font-size");
//   new removeClassNameAll(document.body, ldqr.FONT_SIZE_CSS_CLASS);
//   document.body.classList.add(d);
// }

// function choixSpaceWord(d) {
//   var elt = document.getElementById(d);
//   new appliqueChecked(elt, ".space-word");
//   new removeClassNameAll(document.body, ldqr.FONT_SPACE_WORD_CSS_CLASS);
//   document.body.classList.add(d);
// }
// function choixSpaceCar(d) {
//   var elt = document.getElementById(d);
//   new appliqueChecked(elt, ".space-car");
//   new removeClassNameAll(document.body, ldqr.FONT_SPACE_CAR_CSS_CLASS);
//   document.body.classList.add(d);
// }
// function choixSpaceLine(d) {
//   var elt = document.getElementById(d);
//   new appliqueChecked(elt, ".space-line");
//   new removeClassNameAll(document.body, ldqr.FONT_SPACE_LINE_CSS_CLASS);
//   document.body.classList.add(d);
// }
function choixCouleurFond(d) {
  var elt = document.getElementById(d);
  new appliqueChecked(elt, ".couleur-fond");

  // var zoneTexte = document.getElementById("monTexte");
  var zoneTexte = document.querySelector("body");

  if (zoneTexte) {
    // zoneTexte=zoneTexte.querySelector('div');
    new removeClassNameAll(zoneTexte, ldqr.COULEURS_FOND_CSS_CLASS);

    zoneTexte.classList.add(d);
    var dys = document.getElementById("choixCouleurDYS");
    if (dys) {
      if (d !== "ldqr-couleur-fond-blanc") {
        new activerDesactiverBoutonDYS("desactiverDYS");
        dys.setAttribute("aria-hidden", "true");
        dys.classList.add("notDisplay");
      } else {
        dys.classList.remove("notDisplay");
        dys.setAttribute("aria-hidden", "false");
      }
    }
  }
  // var zoomEltSvg = document.querySelector(".zoomEltSvg");
  var monTexte = document.querySelector("section.section-texte");

  // new appliqueChecked(elt, ".couleur-fond");
  if (!monTexte) return;
  new removeClassNameAll(monTexte, ldqr.COULEURS_FOND_CSS_CLASS);
  monTexte.classList.add(d);

  // if (zoomEltSvg) {
  //   new removeClassNameAll(zoomEltSvg, ldqr.COULEURS_FOND_CSS_CLASS);
  //   zoomEltSvg.classList.add(d);
  // }
}
function removeClassNameAll(elt, arrayClass) {
  var ALength = arrayClass.length,
    i;
  for (i = 0; i !== ALength; i++) {
    elt.classList.remove(arrayClass[i]);
  }
}

function appliqueChecked(el, ensemble) {
  var bouton1 = document.querySelector(".bouton-choix-police");
  var bouton2 = document.querySelector(".couleur-fond");
  if (!bouton1) return;
  if (!bouton2) return;
  var mesBoutons = document.querySelectorAll(ensemble),
    mesBoutonsLength = mesBoutons.length,
    i;
  for (i = 0; i !== mesBoutonsLength; i++) {
    mesBoutons[i].setAttribute("aria-checked", "false");
    mesBoutons[i].classList.add("unchecked");
    mesBoutons[i].classList.remove("checked");
    // mesBoutons[i].tabIndex = -1;
  }
  el.setAttribute("aria-checked", "true");
  el.classList.add("checked");
  el.classList.remove("unchecked");
  // el.tabIndex = 0;
  // el.focus();
}

function choixVersionImage(d) {
  var defImage = document.querySelector(".def-image");
  if (!defImage) return;
  initVersionImage();
  console.log(d);
  var chiffres = {
    version01: "chiffre1",
    version02: "chiffre2",
    version03: "chiffre3",
    version04: "chiffre4",
    version05: "chiffre5",
  };
  var keys = Object.keys(chiffres);
  for (var i = 0; i !== keys.length; i++) {
    console.log(keys[i]);
    if (d === keys[i]) {
      document.getElementById(chiffres[d]) && document.getElementById(chiffres[d]).classList.remove("notDisplay");
    } else {
      document.getElementById(chiffres[keys[i]]) && document.getElementById(chiffres[keys[i]]).classList.add("notDisplay");
    }
  }

  var elt = document.getElementById(d);

  var boutonVersion = document.getElementById("boutonVersion");
  // boutonVersion.childNodes[3].innerHTML = elt.childNodes[3].innerHTML;
  appliqueChecked(elt, ".def-image");

  var mesVersions = document.querySelectorAll("." + d),
    mesVersionsLength = mesVersions.length,
    i;
  for (i = 0; i !== mesVersionsLength; i++) {
    mesVersions[i].classList.remove("notDisplay");
  }
}
function choixVersionImage00() {
  console.log("choixVersionImage00");
  var bw = document.getElementById("boutonBW");
  // var boutonsCouleurImage = document.getElementById("boutonsCouleurImage");
  // console.log(boutonsCouleurImage.children);
  if (!bw) {
    return;
  }
  bw = bw.classList.contains("notDisplay");
  var mesImages = document.querySelectorAll(".imagesVersion"),
    i = 0,
    id = "",
    version = "",
    coul = "",
    limg = mesImages.length;
  var mesBoutons = document.querySelectorAll(".def-image");
  for (j = 0; j !== mesBoutons.length; j++) {
    if (mesBoutons[j].classList.contains("checked")) {
      var bChecked = mesBoutons[j].getAttribute("id");
    }
  }
  for (; i !== limg; i++) {
    id = mesImages[i].getAttribute("id");
    version = id.split("-")[1];
    coul = id.split("-")[2];
    // mesImages[i].classList.add("notDisplay");
    console.log(bw, coul, bChecked);
    if (version === bChecked) mesImages[i].classList.remove("notDisplay");
    if (bw && coul === "coul" && version === bChecked) {
      mesImages[i].classList.add("notDisplay");
    }
    if (!bw && coul === "nb" && version === bChecked) {
      mesImages[i].classList.add("notDisplay");
    }
  }
}
function activerDesactiverBoutonVersion(d) {
  var elt = document.getElementById(d);

  appliqueChecked(elt, ".bouton-version-active");
  var fondBlanc = document.getElementById("fondBlancBoutonVersion");
  var bouton = document.getElementById("boutonVersion");
  if (!fondBlanc) return;
  console.log(d);

  if (d === "desactiverImageVersion") {
    fondBlanc.classList.add("notDisplay");
    bouton.classList.add("notDisplay");
  } else {
    fondBlanc.classList.remove("notDisplay");
    bouton.classList.remove("notDisplay");
  }
  menuBasTest();
}
function activerDesactiverBoutonCouleur(d) {
  var elt = document.getElementById(d);
  console.log(d);
  appliqueChecked(elt, ".bouton-couleur-active");
  var fondBlanc = document.getElementById("fondBlancBoutonCouleur");
  var bouton = document.getElementById("boutonsCouleurImage");
  if (!fondBlanc) return;
  console.log(d);

  if (d === "desactiverCouleurImage") {
    fondBlanc.classList.add("notDisplay");
    bouton.classList.add("notDisplay");
  } else {
    fondBlanc.classList.remove("notDisplay");
    bouton.classList.remove("notDisplay");
  }
  menuBasTest();
}
function menuBasTest() {
  var boutonsCouleurImage = document.getElementById("boutonsCouleurImage");
  var boutonVersion = document.getElementById("boutonVersion");
  var btnOnOff2 = document.getElementById("btnOnOff2");
  var ligneFond = document.getElementById("ligneFond");
  if (boutonsCouleurImage.classList.contains("notDisplay") && boutonVersion.classList.contains("notDisplay") && btnOnOff2.classList.contains("notDisplay")) {
    ligneFond.classList.add("notDisplay");
  }
}

function activerDesactiverBoutonDYS(d) {
  var elt = document.getElementById(d);
  if (!elt) return;
  appliqueChecked(elt, ".bouton-dys-active");
  // var fondBlanc = document.getElementById("fondBlancBoutonCouleur");
  // var bouton = document.getElementById("boutonsCouleurImage");
  // if (!fondBlanc) return;
  console.log(d);
  var blanc = document.getElementById("ldqr-couleur-fond-blanc");

  if (d === "activerDYS") {
    // var val = returnTabChoix(".dys-choix");
    if (blanc && blanc.classList.contains("unchecked")) {
      new activerDesactiverBoutonDYS("desactiverDYS");
    } else {
      document.body.classList.add("dys");

      // check(false, false, false, true);
    }
  } else {
    document.body.classList.remove("dys");

    // var exempleTexte = document.getElementById("monTexte");
    // var monDiv = exempleTexte.querySelector("div");
    // var regEx = /<span[^>]+>(.*?)<\/span>/g;
    // var t = monDiv.innerHTML.replace(regEx, "$1");
    // monDiv.innerHTML = t;
  }
}

/**
 * Description placeholder
 * @date 24/03/2023 - 16:32:28
 *
 * @param {*} d
 */
function activerMajuscule(d) {
  var elt = document.getElementById(d);
  if (elt) {
    appliqueChecked(elt, ".bouton-majuscule-active");
  }

  var texte = document.querySelectorAll("#monTexte,text");
  if (!texte) return;
  var className = "ldqr-font-minuscule";
  if (d === "activerMajuscule") {
    className = "ldqr-font-majuscule";
  }

  // new removeClassNameAll(document.body, ldqr.FONT_CSS_CLASS);
  for (var i = 0; i !== texte.length; i++) {
    new removeClassNameAll(texte[i], ldqr.FONT_CASSE_CSS_CLASS);
    if (texte[i].getAttribute("id") !== "txt_minuscule") {
      texte[i].classList.add(className);
    }
  }
}

function activerDesactiverBoutonAudio(d) {
  var elt = document.getElementById(d);
  var monAudioPlay = document.getElementById("monAudioPlay");
  if (!elt && !monAudioPlay) {
    return;
  } else if (!elt && monAudioPlay) {
    if (d === "desactiverAudio") {
      monAudioPlay.classList.add("notDisplay");
      monAudioPlay.classList.remove("displayInLine");
    } else {
      monAudioPlay.classList.remove("notDisplay");
      monAudioPlay.classList.add("displayInLine");
    }
  } else {
    appliqueChecked(elt, ".bouton-audio-active");
  }

  // var fondBlanc = document.getElementById("fondBlancBoutonCouleur");
  // var bouton = document.getElementById("boutonsCouleurImage");
  // if (!fondBlanc) return;

  // if (d === "activerAudio") {
  //   var val = returnTabChoix(".dys-choix");
  //   check(val[0], val[1], val[2], val[3]);
  // } else {
  //   var exempleTexte = document.getElementById("exempleTexte");
  //   var monDiv = exempleTexte.querySelector("div");
  //   var regEx = /<span[^>]+>(.*?)<\/span>/g;
  //   var t = monDiv.innerHTML.replace(regEx, "$1");
  //   monDiv.innerHTML = t;

  //   // uncheck();
  // }
}
function affichagePageMenu(id) {
  var maConfig;
  var page_accueil = document.getElementById("Accueil");
  var affiche = false;
  console.log(id);
  switch (id) {
    case "AudioBoutonChoix":
      maConfig = document.getElementById("configAudio");
      affiche = true;
      break;
    case "ImageBoutonChoix":
      maConfig = document.getElementById("configImage");
      affiche = true;
      break;
    case "TexteBoutonChoix":
      maConfig = document.getElementById("configTexte");
      affiche = true;
      break;
    case "boutonValiderConfigAudio":
      maConfig = document.getElementById("configAudio");

      break;
    case "boutonValiderConfigImage":
      maConfig = document.getElementById("configImage");

      break;
    case "boutonValiderConfigTexte":
      maConfig = document.getElementById("configTexte");

      break;

    default:
      break;
  }
  if (affiche) {
    maConfig.classList.remove("notDisplay");
    page_accueil.classList.add("notDisplay");
  } else {
    maConfig.classList.add("notDisplay");
    page_accueil.classList.remove("notDisplay");
  }
}

function activerDesactiverBoutonDYSchoix(d) {
  // console.log(d);
  // check(italiqueBool,grasBool,soulignementBool,muetBool)

  ldqr.DATA_LOCAL_FORAGE.getItem("bouton-dys-active").then(function (dys) {
    console.log("DYS : ", dys);
    if (dys === "activerDYS") {
      document.body.classList.add("dys");
      // check(d[0], d[1], d[2], true);
    } else {
      document.body.classList.remove("dys");
    }
  });
}
function affichageTexte(d) {
  var elt = document.getElementById(d);
  var monTexte = document.querySelector(".section-texte");
  var monTextePage0 = document.querySelector("#monTexte");
  if (elt) {
    new appliqueChecked(elt, ".affiche-texte");
  }
  if (monTexte) {
    if (d === "masquerTexte") {
      monTexte.classList.add("notDisplay");
    } else {
      monTexte.classList.remove("notDisplay");
    }
  }
  if (monTextePage0) {
    if (d === "masquerTexte") {
      monTextePage0.classList.add("notDisplay");
    } else {
      monTextePage0.classList.remove("notDisplay");
    }
  }
  console.log(monTexte);
}
function affichageImage(d) {
  var elt = document.getElementById(d);
  var monTexte = document.querySelector(".section-figure");
  if (elt) {
    new appliqueChecked(elt, ".affiche-image");
  }
  if (!monTexte) return;
  if (d === "masquerImage") {
    monTexte.classList.add("notDisplay");
  } else {
    monTexte.classList.remove("notDisplay");
  }
}
function choixCouleurImage(d) {
  console.log(d);
  var groupeImage = document.getElementById("groupeImage");
  if (!groupeImage) {
    return;
  }
  var elt = document.getElementById(d);
  var boutonBW = document.getElementById("boutonBW");
  var boutonCouleur = document.getElementById("boutonCouleur");
  var zoom = document.querySelector(".zoomElt");
  // elt.setAttribute('aria-hidden',"true");

  elt && elt.classList.add("notDisplay");

  switch (d) {
    case "boutonCouleur":
    case "imagesCouleur":
      boutonBW && boutonBW.classList.remove("notDisplay");
      groupeImage.classList.remove("nb");
      zoom.classList.remove("nb");

      break;
    case "boutonBW":
    case "imagesNB":
      boutonCouleur && boutonCouleur.classList.remove("notDisplay");
      groupeImage.classList.add("nb");
      zoom.classList.add("nb");

      break;
    case "imagesNeg":
      break;
    default:
      break;
  }
}

function choixTexteImage(d) {
  var elt = document.getElementById(d);
  new appliqueChecked(elt, ".texte-image");

  var mesElts,
    i,
    mesEltsLength = 0;
  switch (d) {
    case "texteSeul":
      mesElts = document.querySelectorAll("#groupeImage,#version,#couleurImage,#Emile_Image");
      mesEltsLength = mesElts.length;
      for (i = 0; i !== mesEltsLength; i++) {
        mesElts[i].classList.add("notDisplay");
      }
      mesElts = document.querySelectorAll("#monTexte,#textePage");
      mesEltsLength = mesElts.length;
      for (i = 0; i !== mesEltsLength; i++) {
        mesElts[i].classList.remove("notDisplay");
      }
      break;
    case "imageSeule":
      mesElts = document.querySelectorAll("#monTexte,#textePage");
      mesEltsLength = mesElts.length;
      for (i = 0; i !== mesEltsLength; i++) {
        mesElts[i].classList.add("notDisplay");
      }
      mesElts = document.querySelectorAll("#groupeImage,#version,#couleurImage,#Emile_Image");
      mesEltsLength = mesElts.length;
      for (i = 0; i !== mesEltsLength; i++) {
        mesElts[i].classList.remove("notDisplay");
      }
      break;
    case "texteImage":
      mesElts = document.querySelectorAll("#monTexte,#textePage,#groupeImage,#version,#couleurImage,#Emile_Image");
      mesEltsLength = mesElts.length;
      for (i = 0; i !== mesEltsLength; i++) {
        mesElts[i].classList.remove("notDisplay");
      }
      break;
  }
}

function returnTabChoix(classe) {
  // check(italiqueBool,grasBool,soulignementBool,muetBool)
  var mesClasses = document.querySelectorAll(classe),
    mesClassesLength = mesClasses.length,
    tab = [false, false, false, true];
  for (i = 0; i !== mesClassesLength; i++) {
    if (mesClasses[i].classList.contains("checked")) {
      switch (mesClasses[i].getAttribute("id")) {
        case "italique":
          tab[0] = true;
          break;
        case "gras":
          tab[1] = true;
          break;
        case "souligne":
          tab[2] = true;
          break;
        case "muet":
          tab[3] = true;
          break;
      }
    }
  }
  return tab;
}

// function getMobileOperatingSystem() {
//   var a = navigator.userAgent || navigator.vendor || window.opera;
//   if (/windows/i.test(a)) {
//     return "Windows";
//   }
//   if (/android/i.test(a)) {
//     return "Android";
//   }
//   if (/iPad|iPhone|iPod/.test(a) && !window.MSStream) {
//     return "iOS";
//   }
//   return "iOS";
// }

/**
 * Crée les instances quand le DOM est chargé
 */
window.addEventListener(
  "DOMContentLoaded",
  function () {
    window.ldqrController = new ldqrBaseController();
  },
  false
);
