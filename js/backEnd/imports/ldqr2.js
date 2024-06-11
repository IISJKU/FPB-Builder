var ldqr = {};
function ldqrBaseController() {
  this.initConfigurables(), this.initComponents(), this.appliqueLocalForage();
}
function initVersionImage() {
  for (var e = ldqr.DEGRES_APERCU, t = e.length, o = 0; o !== t; o++)
    for (var a = document.querySelectorAll("." + e[o]), n = a.length, s = 0; s !== n; s++) a[s].addClassName("notDisplay");
}
function ldqrBoutonBaseController() {
  for (var e = document.querySelectorAll(ldqr.CONTROLE_BOUTON_CSS_SELECTOR), t = e.length - 1; t >= 0; t--) new ldqrBoutonController(e[t]);
}
function ldqrBoutonController(e) {
  this.el = e;
  for (var t = 0; t < ldqr.START_EVENT.length; t++) this.el.addEventListener(ldqr.START_EVENT[t], this, !1);
  this.el.addEventListener("keydown", this, !1);
}
(ldqr.CHANGE_PAGE_CSS_SELECTOR = ".change-page"),
  (ldqr.VITESSE_SON_VOIX = 1),
  (ldqr.VITESSE_DOUBLE_TAPE = 0.5),
  (ldqr.START_EVENT = ["touchstart", "mousedown"]),
  (ldqr.MOVE_EVENT = ["touchmove", "mousemove"]),
  (ldqr.END_EVENT = ["touchend", "mouseup"]),
  (ldqr.Utils = {}),
  (Element.prototype.hasClassName = function (e) {
    return new RegExp("(?:^|\\s+)" + e + "(?:\\s+|$)").test(this.getAttribute("class"));
  }),
  (SVGElement.prototype.getTransformToElement =
    SVGElement.prototype.getTransformToElement ||
    function (e) {
      return e.getScreenCTM().inverse().multiply(this.getScreenCTM());
    }),
  (Element.prototype.addClassName = function (e) {
    return !this.hasClassName(e) && (this.setAttribute("class", [this.getAttribute("class"), e].join(" ").trim()), !0);
  }),
  (Element.prototype.removeClassName = function (e) {
    if (this.hasClassName(e)) {
      var t = this.getAttribute("class");
      return this.setAttribute("class", t.replace(new RegExp("(?:^|\\s+)" + e + "(?:\\s+|$)", "g"), " ")), !0;
    }
    return !1;
  }),
  (Element.prototype.toggleClassName = function (e, t) {
    null == t && (t = !this.hasClassName(e)), this[t ? "addClassName" : "removeClassName"](e);
  }),
  (ldqrBaseController.prototype.initConfigurables = function () {
    var e = document.getElementById("player");
    e && e.pause(),
      (ldqr.SVG_POS = function () {
        var e = document.getElementById("Emile_Image_SVG"),
          t = e.getBoundingClientRect(),
          o = e.getAttribute("viewBox");
        return { left: t.left - o.split(" ")[0], top: t.top - o.split(" ")[1] };
      }),
      (ldqr.POSITION_LDQR_ACTIF = {
        p01fig: {
          Emile: [210, 381, 290, 315],
          ChauveSouris: [120, 310, 260, 240],
          vase1Decor1: [205, 533, 108, 140],
          vase2Decor2: [205, 563, 108, 140],
          table1Decor1: [95, 600, 600, 220],
          table2Decor2: [95, 600, 600, 220],
          lampeDecor1: [543, 223, 78, 380],
          lampeDecor2: [543, 350, 78, 460],
        },
        p02fig: { ChauveSouris: [0, 330, 680, 395] },
        p03fig: { Emile: [15, 330, 600, 355] },
        p04fig: { ChauveSouris: [212, 102, 395, 800] },
        p05fig: { Emile: [245, 457, 348, 300], Coussin1: [56, 403, 300, 150] },
        p06fig: { Emile: [262, 474, 348, 300], Coussin: [190, 358, 260, 130], Manique: [568, 481, 140, 70] },
        p07fig: {
          CS1Grotte: [302, 569, 50, 100],
          CS2Grotte: [409, 448, 50, 100],
          CS3Grotte: [481, 540, 50, 100],
          CS4Grotte: [552, 688, 50, 100],
          CS5Grotte: [642, 569, 30, 60],
        },
        p08fig: {
          Vase1: [86, 606, 125, 150],
          Vase2: [86, 606, 125, 150],
          Emile: [251, 341, 230, 135],
          Coussin1: [159, 353, 140, 120],
          Coussin2: [450, 340, 170, 130],
        },
        p09fig: {
          CS: [68, 5, 295, 520],
          Emile: [346, 5, 295, 540],
          Coussin1: [17, 744, 270, 180],
          Coussin2: [445, 710, 240, 160],
          Vase1: [341, 718, 125, 150],
          Vase2: [341, 718, 125, 150],
        },
        p10fig: { Emile: [166, 572, 150, 150], Vase1: [129, 832, 125, 150], Vase2: [129, 832, 125, 150] },
        p11fig: {
          Emile: [273, 745, 150, 240],
          Vase1: [665, 780, 70, 80],
          Vase2: [665, 780, 70, 80],
          Lampe1: [496, 510, 90, 320],
          Chauffage: [495, 672, 150, 150],
          Meuble: [660, 462, 125, 370],
          Table1: [468, 813, 300, 150],
          Table2: [468, 813, 300, 150],
        },
        p12fig: {
          Emile: [271, 534, 300, 300],
          Lampe1: [185, 255, 150, 600],
          Lampe2: [185, 255, 150, 600],
          Chauffage1: [46, 520, 220, 220],
          Chauffage2: [46, 560, 220, 220],
        },
        p13fig: {
          Emile1: [40, 391, 520, 520],
          CSZoomEtape3: [394, 350, 130, 260],
          Vase1: [373, 264, 70, 200],
          Vase2: [665, 780, 70, 80],
          Souris: [103, 600, 140, 90],
        },
        p14fig: { CS0: [577, 448, 50, 100], Emile: [373, 460, 250, 250], Coussin1: [46, 524, 220, 200], Coussin2: [472, 530, 220, 200] },
        p15fig: { CS2Grand: [-138, 440, 340, 237], Moustique: [173, 577, 100, 100] },
        p16fig: { Manique: [263, 511, 110, 110], Emile: [373, 375, 210, 210], Coussin1: [69, 417, 220, 200], Coussin2: [501, 410, 220, 200] },
        p17fig: { Manique: [263, 511, 110, 110], Emile: [373, 375, 210, 210], Coussin1: [69, 417, 220, 200], Coussin2: [501, 410, 220, 200] },
        p18fig: { Manique: [95, 573, 200, 200], Emile: [175, 264, 320, 405], Coussin: [431, 300, 360, 360] },
        p19fig: { Emile: [130, 330, 400, 400], Coussin: [400, 360, 360, 360] },
        p20fig: { Emile: [325, 320, 300, 300], Coussin1: [23, 390, 200, 200], Coussin2: [440, 410, 200, 200] },
        p21fig: { Pieuvre: [284, 369, 680, 285] },
      });
    for (var t = document.querySelectorAll("svg"), o = 0; o !== t.length; o++)
      for (var a = ["touchstart", "mousedown"], n = 0; n != a.length; n++)
        t[o].addEventListener(a[n], function (e) {
          var t = document.querySelectorAll(".opacity1,.opacity02");
          for (k = 0; k !== t.length; k++) t[k].removeClassName("opacity1"), t[k].removeClassName("opacity02");
          e.stopPropagation(), e.preventDefault();
        });
    (ldqr.DATA_LOCAL_FORAGE = localforage.createInstance({ name: "ldqr_emile_test" })),
      (ldqr.CONTROLE_ACTIF_CSS_SELECTOR = ".ldqr-actif"),
      (ldqr.CONTROLE_BOUTON_CSS_SELECTOR = ".svg-bouton,#boutonCouleur,#boutonBW,#boutonVersion"),
      (ldqr.TAP_THRESHOLD = 10),
      (ldqr.DELTA_TIME = 300),
      (ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR = ".zoomElt"),
      (ldqr.ZOOM_OPTIONS = {
        initialViewBox: { x: 0, y: 0, width: 748, height: 1024 },
        limits: 50,
        animationTime: 0,
        zoom: { factor: 0.25, minZoom: 1, maxZoom: 50, callback: function (e) {} },
      }),
      (ldqr.DEGRES_APERCU = ["version01", "version02", "version03", "version04", "version05"]),
      (ldqr.COULEURS_FOND_CSS_CLASS = [
        "ldqr-couleur-fond-blanc",
        "ldqr-couleur-fond-gris",
        "ldqr-couleur-fond-neg",
        "ldqr-couleur-fond-beige",
        "ldqr-couleur-fond-jaune",
      ]),
      (ldqr.TEXTE_SELECT = ["texteSeul", "imageSeule", "texteImage"]),
      (ldqr.TXT_BOUTON_TOGGLE_TEXTE = ["Image seule", "Texte et image"]),
      (ldqr.FONT_CSS_CLASS = ["ldqr-font-luciole", "ldqr-font-verdana", "ldqr-font-arial-black", "ldqr-font-dys", "ldqr-font-arial"]),
      (ldqr.FONT_SIZE_CSS_CLASS = ["ldqr-font-size-26", "ldqr-font-size-24", "ldqr-font-size-20"]),
      (ldqr.FONT_INTERLIGNE_CSS_CLASS = ["ldqr-interligne-1", "ldqr-interligne-2", "ldqr-interligne-3"]),
      (ldqr.FONT_SPACE_WORD_CSS_CLASS = ["ldqr-space-word-1", "ldqr-space-word-2", "ldqr-space-word-3"]),
      (ldqr.FONT_CASSE_CSS_CLASS = ["ldqr-font-majuscule", "ldqr-font-minuscule"]),
      (ldqr.FONT_SPACE_CAR_CSS_CLASS = ["ldqr-space-car-1", "ldqr-space-car-2", "ldqr-space-car-3"]),
      (ldqr.FONT_SPACE_LINE_CSS_CLASS = ["ldqr-space-line-1", "ldqr-space-line-2", "ldqr-space-line-3"]),
      (ldqr.DEFERRED_EVENT_DELAY = 1e3);
  }),
  (ldqrBaseController.prototype.initComponents = function () {
    (this.boutonsChoix = new ldqrBoutonBaseController()), (this.boutonsSurprise = new ldqrBoutonBaseSurprise()), (this.svgAction = new ldqrSvgBaseController());
  }),
  (ldqrBaseController.prototype.appliqueLocalForage = function () {
    ldqr.DATA_LOCAL_FORAGE.getItem("font-name").then(function (e) {
      new choixFontName((e = e || "choixLucioleBold"));
    }),
      // applique la casse
      ldqr.DATA_LOCAL_FORAGE.getItem("font-casse").then(function (d) {
        d = d || "activerMinuscule";
        console.log(d);
        new activerMajuscule(d);
      });

    ldqr.DATA_LOCAL_FORAGE.getItem("couleur-fond").then(function (e) {
      new choixCouleurFond((e = e || ldqr.COULEURS_FOND_CSS_CLASS[0]));
    }),
      ldqr.DATA_LOCAL_FORAGE.getItem("texte-image").then(function (e) {
        e = e || "texteImage";
      }),
      ldqr.DATA_LOCAL_FORAGE.getItem("def-image").then(function (e) {
        new choixVersionImage((e = e || "version01")), new choixVersionImage00();
      }),
      ldqr.DATA_LOCAL_FORAGE.getItem("couleur-image").then(function (e) {
        new choixCouleurImage((e = e || "boutonCouleur")), new choixVersionImage00();
      }),
      ldqr.DATA_LOCAL_FORAGE.getItem("bouton-version-active").then(function (e) {
        new activerDesactiverBoutonVersion((e = e || "activerImageVersion"));
      }),
      ldqr.DATA_LOCAL_FORAGE.getItem("bouton-couleur-active").then(function (e) {
        new activerDesactiverBoutonCouleur((e = e || "activerCouleurImage"));
      }),
      ldqr.DATA_LOCAL_FORAGE.getItem("bouton-dys-active").then(function (e) {
        new activerDesactiverBoutonDYS((e = e || "desactiverDYS"));
      }),
      ldqr.DATA_LOCAL_FORAGE.getItem("bouton-audio-active").then(function (e) {
        new activerDesactiverBoutonAudio((e = e || "activerAudio"));
      }),
      ldqr.DATA_LOCAL_FORAGE.getItem("bouton-dys-choix").then(function (e) {
        new activerDesactiverBoutonDYSchoix((e = e || [!1, !1, !1, !1]));
      }),
      ldqr.DATA_LOCAL_FORAGE.getItem("vitesse-audio-voix").then(function (e) {
        (e = e || 1), (ldqr.VITESSE_SON_VOIX = e);
        var t = document.getElementById("vitesseAudioVal"),
          o = t && t.querySelector("text");
        o && (o.innerHTML = e);
      });
  }),
  (ldqrBoutonController.prototype.touchStart = function (e) {
    switch ((e.preventDefault(), e.stopPropagation(), e.type)) {
      case "mousedown":
      case "mouseup":
        (this.startX = e.clientX), (this.startY = e.clientY);
        break;
      case "touchstart":
      case "touchend":
        (this.startX = e.changedTouches[0].clientX), (this.startY = e.changedTouches[0].clientY);
        break;
      default:
        break;
    }
    window.addEventListener("touchend", this, !1), window.addEventListener("mouseup", this, !1);
  });
var tapStart = 0,
  nbTouch = 0;
function ldqrSvgBaseController() {
  var e = document.querySelector(ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR);
  e && this.initSvgPanZoom(), e && this.initCloseButton();
  for (var t = document.querySelectorAll(ldqr.CONTROLE_ACTIF_CSS_SELECTOR), o = t.length - 1; o >= 0; o--) new ldqrSvgController(t[o], this.SVGPanZoom);
}
function ldqrSvgController(e, t) {
  (this.el = e),
    (this.SVGPanZoom = t),
    e.addEventListener(
      "mousemove",
      function (e) {
        e.preventDefault();
      },
      !1
    ),
    e.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
      },
      !1
    ),
    this.el.addEventListener("mousedown", this, !1),
    this.el.addEventListener("mouseup", this, !1),
    this.el.addEventListener("touchstart", this, !1),
    this.el.addEventListener("touchend", this, !1);
}
(ldqrBoutonController.prototype.touchEnd = function (e) {
  window.removeEventListener("touchend", this, !1), window.removeEventListener("mouseup", this, !1);
  var t = "",
    o = "";
  switch (e.type) {
    case "mousedown":
    case "mouseup":
      (t = e.clientX), (o = e.clientY);
      break;
    case "touchstart":
    case "touchend":
      (t = e.changedTouches[0].clientX), (o = e.changedTouches[0].clientY);
      break;
    default:
      break;
  }
  (this.xTap = Math.abs(this.startX - t) < ldqr.TAP_THRESHOLD),
    (this.yTap = Math.abs(this.startY - o) < ldqr.TAP_THRESHOLD),
    this.xTap && this.yTap && (e.preventDefault(), e.stopPropagation(), this.setLocalForage());
}),
  (ldqrBoutonController.prototype.setLocalForage = function (e) {
    var elt = this.el;

    var eltId = elt.getAttribute("id");

    var monAudioPage0 = document.getElementById("monTexteAudio");
    if (elt.hasClassName("bouton-choix-police")) new choixFontName(eltId);
    else if (elt.hasClassName("font-size")) ldqr.DATA_LOCAL_FORAGE.setItem("font-size", eltId).then(function (e) {});
    else if (elt.hasClassName("space-word")) ldqr.DATA_LOCAL_FORAGE.setItem("space-word", eltId).then(function (e) {});
    else if (elt.hasClassName("space-car")) ldqr.DATA_LOCAL_FORAGE.setItem("space-car", eltId).then(function (e) {});
    else if (elt.hasClassName("space-line")) ldqr.DATA_LOCAL_FORAGE.setItem("space-line", eltId).then(function (e) {});
    else if (elt.hasClassName("couleur-fond")) new choixCouleurFond(eltId);
    else if (elt.hasClassName("texte-image")) ldqr.DATA_LOCAL_FORAGE.setItem("texte-image", eltId).then(function (e) {});
    else if (elt.hasClassName("couleur-image")) new choixCouleurImage(eltId), choixVersionImage00();
    else if (elt.hasClassName("def-image")) new choixVersionImage(eltId), choixVersionImage00();
    else if (elt.hasClassName("affiche-texte"))
      ldqr.DATA_LOCAL_FORAGE.setItem("affiche-texte", eltId).then(function (e) {
        new affichageTexte(e);
      });
    else if (elt.hasClassName("affiche-image"))
      ldqr.DATA_LOCAL_FORAGE.setItem("affiche-image", eltId).then(function (e) {
        new affichageImage(e);
      });
    else if ("boutonBW" === eltId || "boutonCouleur" === eltId) new choixCouleurImage(eltId), new choixVersionImage00();
    else if ("boutonVersion" === eltId) {
      var n = document.getElementById("menuBas"),
        s = document.getElementById("boutonsAllVersion");
      n.hasClassName("haut")
        ? (n.removeClassName("haut"), n.addClassName("bas"), s.removeClassName("displayInLine"), s.addClassName("notDisplay"))
        : (n.removeClassName("bas"), n.addClassName("haut"), s.removeClassName("notDisplay"), s.addClassName("displayInLine"));
    } else if (elt.hasClassName("bouton-version-active")) new activerDesactiverBoutonVersion(eltId);
    else if (eltId === "activerMajuscule" || eltId === "activerMinuscule") {
      new activerMajuscule(eltId);
      // ldqr.DATA_LOCAL_FORAGE.setItem("bouton-dys-active", eltId).then(function (d) {
      //   new activerDesactiverBoutonDYS(eltId);
      // });
    } else if ("desactiverCouleurImage" === eltId || "activerCouleurImage" === eltId) new activerDesactiverBoutonCouleur(eltId);
    else if ("desactiverDYS" === eltId || "activerDYS" === eltId) new activerDesactiverBoutonDYS(eltId);
    else if ("audioPlus" === eltId || "audioMoins" === eltId)
      (ldqr.VITESSE_SON_VOIX = "audioPlus" === eltId ? ldqr.VITESSE_SON_VOIX + 0.2 : ldqr.VITESSE_SON_VOIX - 0.2),
        ldqr.VITESSE_SON_VOIX < 0.2 && (ldqr.VITESSE_SON_VOIX = 0.2),
        ldqr.VITESSE_SON_VOIX > 4 && (ldqr.VITESSE_SON_VOIX = 4),
        ldqr.DATA_LOCAL_FORAGE.setItem("vitesse-audio-voix", Math.round(100 * ldqr.VITESSE_SON_VOIX) / 100).then(function (e) {
          (document.getElementById("vitesseAudioVal").querySelector("text").innerHTML = e),
            (monAudioPage0.currentTime = 0),
            (monAudioPage0.playbackRate = e),
            monAudioPage0.play();
        });
    else if ("desactiverAudio" === eltId || "activerAudio" === eltId)
      ldqr.DATA_LOCAL_FORAGE.setItem("bouton-audio-active", eltId).then(function (e) {
        new activerDesactiverBoutonAudio(eltId);
      });
    else if ("gras" === eltId || "italique" === eltId || "souligne" === eltId || "muet" === eltId) {
      elt.hasClassName("checked")
        ? (elt.addClassName("unchecked"), elt.removeClassName("checked"))
        : (elt.addClassName("checked"), elt.removeClassName("unchecked")),
        new activerDesactiverBoutonDYSchoix(returnTabChoix(".bouton-dys-choix"));
    } else elt.hasClassName("pa-menu-bouton") && new affichagePageMenu(eltId);
  }),
  (ldqrBoutonController.prototype.handleEvent = function (e) {
    switch ((e.stopPropagation(), e.preventDefault(), e.type)) {
      case "mousedown":
      case "touchstart":
        this.touchStart(e);
        break;
      case "mouseup":
      case "touchend":
        this.touchEnd(e);
        break;
      case "keydown":
        break;
    }
  }),
  (ldqrSvgBaseController.prototype.initSvgPanZoom = function () {
    var e = {},
      t = document.querySelector(ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR),
      o = t.querySelector("svg");
    (e.panZoom = new SVGPanZoom(o, ldqr.ZOOM_OPTIONS)), (e.zoomElt = o), (e.zoomEltDiv = t), (this.SVGPanZoom = e);
  }),
  (ldqrSvgBaseController.prototype.initCloseButton = function (e) {
    var t = this.SVGPanZoom.zoomEltDiv,
      o = this.SVGPanZoom.zoomElt,
      a = t.querySelector(".close-bouton");
    if (a)
      for (var n = ["touchstart", "mousedown"], s = 0; s != n.length; s++)
        a.addEventListener(n[s], function (e) {
          e.stopPropagation(), e.preventDefault(), (o.innerHTML = ""), t.addClassName("notDisplay");
        });
  });
var lastTap = 0;
function ldqrBoutonBaseSurprise() {
  for (var e = document.querySelectorAll(".bouton-surprise"), t = e.length - 1; t >= 0; t--) new ldqrBoutonSurprise(e[t]);
}
function ldqrBoutonSurprise(e) {
  (this.el = e),
    (this.el.style.cursor = "pointer"),
    this.el.addEventListener("mousedown", this, !1),
    this.el.addEventListener("mouseup", this, !1),
    this.el.addEventListener("touchstart", this, !1),
    this.el.addEventListener("touchend", this, !1),
    this.el.addEventListener("keydown", this, !1);
}
function ldrqOpacityElement(e) {
  var t,
    o = e.parentElement.children;
  if (e.hasClassName("opacity1")) for (t = 0; t !== o.length; t++) o[t].removeClassName("opacity1"), o[t].removeClassName("opacity02");
  else if (e.hasClassName("opacity02")) {
    for (t = 0; t !== o.length; t++) o[t].removeClassName("opacity1"), o[t].addClassName("opacity02");
    e.addClassName("opacity1");
  } else {
    for (t = 0; t !== o.length; t++) o[t].removeClassName("opacity1"), o[t] !== e && o[t].addClassName("opacity02");
    e.addClassName("opacity1");
  }
}
function ldqrZoomElement(e, t) {
  //e is the clicked svg object
  t.panZoom.reset();
  //console.log(e.getBBox());

  var container = document.getElementById("fondImage");
  var containerWidth = container.getAttribute("width");

  var boundingBox = e.getBBox();
  console.log(t.panZoom.getViewBox());
  console.log(e.getBBox());

  var factor = 1.3; //1 == full on zoom, filling screen

  var a = e.getBBox();

  var width = a.width * factor;
  var height = a.height * factor;

  var x = a.x - (width - a.width) / 2;
  var y = a.y - (height - a.height) / 2;

  var o = document.querySelector("title"),
    n = t.zoomElt,
    s = e.cloneNode(!0),
    i = document.querySelector(ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR);
  s.removeClassName("opacity02"), i.removeClassName("notDisplay"), n.appendChild(s), n.removeClassName("notDisplay"), t.panZoom.setViewBox(x, y, width, height);
  console.log(t.panZoom.getViewBox());
}
function choixFontName(e) {
  var t = document.getElementById(e),
    o = "",
    a = !1,
    n = document.getElementById("monTexte");
  if (n) {
    switch ((new appliqueChecked(t, ".bouton-choix-police"), new removeClassNameAll(n, ldqr.FONT_CSS_CLASS), n.removeClassName("ldqr-font-bold"), e)) {
      case "choixLuciole":
        o = "ldqr-font-luciole";
        break;
      case "choixLucioleBold":
        (o = "ldqr-font-luciole"), (a = !0);
        break;
      case "choixArialBlack":
        o = "ldqr-font-arial-black";
        break;
      case "choixOpenDys":
        o = "ldqr-font-dys";
        break;
      case "choixVerdana":
        o = "ldqr-font-verdana";
        break;
      case "choixVerdanaBold":
        (o = "ldqr-font-verdana"), (a = !0);
        break;
      default:
        break;
    }
    a && n.addClassName("ldqr-font-bold"), n.addClassName(o);
  }
}
function choixCouleurFond(e) {
  new appliqueChecked(document.getElementById(e), ".couleur-fond");
  var t = document.getElementById("monTexte");
  if (t) {
    new removeClassNameAll(t, ldqr.COULEURS_FOND_CSS_CLASS), t.addClassName(e);
    var o = document.getElementById("choixCouleurDYS");
    o &&
      ("ldqr-couleur-fond-blanc" !== e
        ? (new activerDesactiverBoutonDYS("desactiverDYS"), o.setAttribute("aria-hidden", "true"), o.addClassName("notDisplay"))
        : (o.removeClassName("notDisplay"), o.setAttribute("aria-hidden", "false")));
  }
  var a = document.querySelector("section.section-texte");
  a && (new removeClassNameAll(a, ldqr.COULEURS_FOND_CSS_CLASS), a.addClassName(e));
}
function removeClassNameAll(e, t) {
  var o,
    a = t.length;
  for (o = 0; o !== a; o++) e.removeClassName(t[o]);
}
function appliqueChecked(e, t) {
  var o = document.querySelector(".bouton-choix-police"),
    a = document.querySelector(".couleur-fond");
  if (o && a) {
    var n,
      s = document.querySelectorAll(t),
      i = s.length;
    for (n = 0; n !== i; n++) s[n].setAttribute("aria-checked", "false"), s[n].addClassName("unchecked"), s[n].removeClassName("checked");
    e.setAttribute("aria-checked", "true"), e.addClassName("checked"), e.removeClassName("unchecked");
  }
}
function choixVersionImage(e) {
  if (document.querySelector(".def-image")) {
    initVersionImage();
    for (
      var t = { version01: "chiffre1", version02: "chiffre2", version03: "chiffre3", version04: "chiffre4", version05: "chiffre5" }, o = Object.keys(t), a = 0;
      a !== o.length;
      a++
    )
      e === o[a]
        ? document.getElementById(t[e]) && document.getElementById(t[e]).removeClassName("notDisplay")
        : document.getElementById(t[o[a]]) && document.getElementById(t[o[a]]).addClassName("notDisplay");
    var n = document.getElementById(e);
    document.getElementById("boutonVersion");
    appliqueChecked(n, ".def-image");
    var s = document.querySelectorAll("." + e),
      i = s.length;
    for (a = 0; a !== i; a++) s[a].removeClassName("notDisplay");
  }
}
function choixVersionImage00() {
  var e = document.getElementById("boutonBW");
  if (e) {
    e = e.hasClassName("notDisplay");
    var t = document.querySelectorAll(".imagesVersion"),
      o = 0,
      a = "",
      n = "",
      s = "",
      i = t.length,
      r = document.querySelectorAll(".def-image");
    for (j = 0; j !== r.length; j++) if (r[j].hasClassName("checked")) var l = r[j].getAttribute("id");
    for (; o !== i; o++)
      (n = (a = t[o].getAttribute("id")).split("-")[1]),
        (s = a.split("-")[2]),
        n === l && t[o].removeClassName("notDisplay"),
        e && "coul" === s && n === l && t[o].addClassName("notDisplay"),
        e || "nb" !== s || n !== l || t[o].addClassName("notDisplay");
  }
}
function activerDesactiverBoutonVersion(e) {
  appliqueChecked(document.getElementById(e), ".bouton-version-active");
  var t = document.getElementById("fondBlancBoutonVersion"),
    o = document.getElementById("boutonVersion");
  t &&
    ("desactiverImageVersion" === e
      ? (t.addClassName("notDisplay"), o.addClassName("notDisplay"))
      : (t.removeClassName("notDisplay"), o.removeClassName("notDisplay")),
    menuBasTest());
}
function activerDesactiverBoutonCouleur(e) {
  appliqueChecked(document.getElementById(e), ".bouton-couleur-active");
  var t = document.getElementById("fondBlancBoutonCouleur"),
    o = document.getElementById("boutonsCouleurImage");
  t &&
    ("desactiverCouleurImage" === e
      ? (t.addClassName("notDisplay"), o.addClassName("notDisplay"))
      : (t.removeClassName("notDisplay"), o.removeClassName("notDisplay")),
    menuBasTest());
}
function menuBasTest() {
  var e = document.getElementById("boutonsCouleurImage"),
    t = document.getElementById("boutonVersion"),
    o = document.getElementById("btnOnOff2"),
    a = document.getElementById("ligneFond");
  e.hasClassName("notDisplay") && t.hasClassName("notDisplay") && o.hasClassName("notDisplay") && a.addClassName("notDisplay");
}
function activerDesactiverBoutonDYS(e) {
  var t = document.getElementById(e);
  if (t) {
    appliqueChecked(t, ".bouton-dys-active");
    var o = document.getElementById("ldqr-couleur-fond-blanc");
    if ("activerDYS" === e) o && o.hasClassName("unchecked") ? new activerDesactiverBoutonDYS("desactiverDYS") : check(!1, !1, !1, !0);
    else {
      var a = document.getElementById("monTexte").querySelector("div"),
        n = a.innerHTML.replace(/<span[^>]+>(.*?)<\/span>/g, "$1");
      a.innerHTML = n;
    }
  }
}
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

function activerDesactiverBoutonAudio(e) {
  var t = document.getElementById(e),
    o = document.getElementById("monAudioPlay");
  (t || o) &&
    (!t && o
      ? "desactiverAudio" === e
        ? (o.addClassName("notDisplay"), o.removeClassName("displayInLine"))
        : (o.removeClassName("notDisplay"), o.addClassName("displayInLine"))
      : appliqueChecked(t, ".bouton-audio-active"));
}
function affichagePageMenu(e) {
  var t,
    o = document.getElementById("Accueil"),
    a = !1;
  switch (e) {
    case "AudioBoutonChoix":
      (t = document.getElementById("configAudio")), (a = !0);
      break;
    case "ImageBoutonChoix":
      (t = document.getElementById("configImage")), (a = !0);
      break;
    case "TexteBoutonChoix":
      (t = document.getElementById("configTexte")), (a = !0);
      break;
    case "boutonValiderConfigAudio":
      t = document.getElementById("configAudio");
      break;
    case "boutonValiderConfigImage":
      t = document.getElementById("configImage");
      break;
    case "boutonValiderConfigTexte":
      t = document.getElementById("configTexte");
      break;
    default:
      break;
  }
  a ? (t.removeClassName("notDisplay"), o.addClassName("notDisplay")) : (t.addClassName("notDisplay"), o.removeClassName("notDisplay"));
}
function activerDesactiverBoutonDYSchoix(e) {
  var t = document.getElementById("muet"),
    o = document.getElementById("souligne"),
    a = document.getElementById("gras"),
    n = document.getElementById("italique"),
    s = (document.getElementById("Emile_Image"), document.querySelectorAll(".section-texte,#monTexte"));
  ldqr.DATA_LOCAL_FORAGE.getItem("bouton-dys-active").then(function (i) {
    "activerDYS" === i && 0 !== s.length && check(e[0], e[1], e[2], !0),
      t &&
        (e[0] && (n.addClassName("checked"), n.removeClassName("unchecked")),
        e[1] && (a.addClassName("checked"), a.removeClassName("unchecked")),
        e[2] && (o.addClassName("checked"), o.removeClassName("unchecked")),
        e[3] && (t.addClassName("checked"), t.removeClassName("unchecked")));
  });
}
function affichageTexte(e) {
  var t = document.getElementById(e),
    o = document.querySelector(".section-texte"),
    a = document.querySelector("#monTexte");
  t && new appliqueChecked(t, ".affiche-texte"),
    o && ("masquerTexte" === e ? o.addClassName("notDisplay") : o.removeClassName("notDisplay")),
    a && ("masquerTexte" === e ? a.addClassName("notDisplay") : a.removeClassName("notDisplay"));
}
function affichageImage(e) {
  var t = document.getElementById(e),
    o = document.querySelector(".section-figure");
  t && new appliqueChecked(t, ".affiche-image"), o && ("masquerImage" === e ? o.addClassName("notDisplay") : o.removeClassName("notDisplay"));
}
function choixCouleurImage(e) {
  var t = document.getElementById("groupeImage");
  if (t) {
    var o = document.getElementById(e),
      a = document.getElementById("boutonBW"),
      n = document.getElementById("boutonCouleur"),
      s = document.querySelector(".zoomElt");
    switch ((o && o.addClassName("notDisplay"), e)) {
      case "boutonCouleur":
      case "imagesCouleur":
        a && a.removeClassName("notDisplay"), t.removeClassName("nb"), s.removeClassName("nb");
        break;
      case "boutonBW":
      case "imagesNB":
        n && n.removeClassName("notDisplay"), t.addClassName("nb"), s.addClassName("nb");
        break;
      case "imagesNeg":
        break;
      default:
        break;
    }
  }
}
function choixTexteImage(e) {
  new appliqueChecked(document.getElementById(e), ".texte-image");
  var t,
    o,
    a = 0;
  switch (e) {
    case "texteSeul":
      for (a = (t = document.querySelectorAll("#groupeImage,#version,#couleurImage,#Emile_Image")).length, o = 0; o !== a; o++) t[o].addClassName("notDisplay");
      for (a = (t = document.querySelectorAll("#monTexte,#textePage")).length, o = 0; o !== a; o++) t[o].removeClassName("notDisplay");
      break;
    case "imageSeule":
      for (a = (t = document.querySelectorAll("#monTexte,#textePage")).length, o = 0; o !== a; o++) t[o].addClassName("notDisplay");
      for (a = (t = document.querySelectorAll("#groupeImage,#version,#couleurImage,#Emile_Image")).length, o = 0; o !== a; o++)
        t[o].removeClassName("notDisplay");
      break;
    case "texteImage":
      for (a = (t = document.querySelectorAll("#monTexte,#textePage,#groupeImage,#version,#couleurImage,#Emile_Image")).length, o = 0; o !== a; o++)
        t[o].removeClassName("notDisplay");
      break;
  }
}
function returnTabChoix(e) {
  var t = document.querySelectorAll(e),
    o = t.length,
    a = [!1, !1, !1, !0];
  for (i = 0; i !== o; i++)
    if (t[i].hasClassName("checked"))
      switch (t[i].getAttribute("id")) {
        case "italique":
          a[0] = !0;
          break;
        case "gras":
          a[1] = !0;
          break;
        case "souligne":
          a[2] = !0;
          break;
        case "muet":
          a[3] = !0;
          break;
      }
  return a;
}
(ldqrSvgController.prototype.touchStart = function (e) {
  e.preventDefault();
  var t = this.SVGPanZoom,
    o = this.el;
  if ((this.timeout, "groupeImage" !== o.getAttribute("id") && "fondImage" !== o.getAttribute("id"))) {
    switch (e.type) {
      case "mousedown":
      case "mouseup":
        (this.startX = e.clientX), (this.startY = e.clientY);
        break;
      case "touchstart":
      case "touchend":
        (this.startX = e.changedTouches[0].clientX), (this.startY = e.changedTouches[0].clientY);
        break;
      default:
        break;
    }
    window.addEventListener("mouseup", this, !1),
      window.addEventListener("touchend", this, !1),
      (this.monTimeOut = setTimeout(function () {
        new ldqrZoomElement(o, t);
      }, 1e3));
  } else {
    var a = document.querySelectorAll(".opacity1,.opacity02");
    for (i = 0; i !== a.length; i++) a[i].removeClassName("opacity1"), a[i].removeClassName("opacity02");
  }
}),
  (ldqrSvgController.prototype.touchEnd = function (e) {
    var t = this.el,
      o = this.SVGPanZoom,
      a = this.timeout,
      n = new Date().getTime(),
      s = n - this.lastTap;
    if (
      (e.stopPropagation(),
      e.preventDefault(),
      clearTimeout(a),
      s < 600 && s > 0
        ? new ldqrZoomElement(t, o)
        : (a = setTimeout(function () {
            clearTimeout(a);
          }, 500)),
      (this.lastTap = n),
      window.removeEventListener("mouseup", this, !1),
      window.removeEventListener("touchend", this, !1),
      clearTimeout(this.monTimeOut),
      document.querySelector(ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR).hasClassName("notDisplay"))
    ) {
      var i = "",
        r = "";
      switch (e.type) {
        case "mousedown":
        case "mouseup":
          (i = e.clientX), (r = e.clientY);
          break;
        case "touchstart":
        case "touchend":
          (i = e.changedTouches[0].clientX), (r = e.changedTouches[0].clientY);
          break;
        default:
          break;
      }
      (this.xTap = Math.abs(this.startX - i) < ldqr.TAP_THRESHOLD),
        (this.yTap = Math.abs(this.startY - r) < ldqr.TAP_THRESHOLD),
        this.xTap && this.yTap && (e.stopPropagation(), e.preventDefault(), new ldrqOpacityElement(t));
    }
  }),
  (ldqrSvgController.prototype.handleEvent = function (e) {
    switch ((e.stopPropagation(), e.preventDefault(), e.type)) {
      case "mousedown":
      case "touchstart":
        this.touchStart(e);
        break;
      case "mouseup":
      case "touchend":
        this.touchEnd(e);
        break;
      case "keydown":
        break;
    }
  }),
  (ldqrBoutonSurprise.prototype.touchStart = function (e) {
    switch ((e.stopPropagation(), e.preventDefault(), e.type)) {
      case "mousedown":
      case "mouseup":
        (this.startX = e.clientX), (this.startY = e.clientY);
        break;
      case "touchstart":
      case "touchend":
        (this.startX = e.changedTouches[0].clientX), (this.startY = e.changedTouches[0].clientY);
        break;
      default:
        break;
    }
    window.addEventListener("mouseup", this, !1), window.addEventListener("touchend", this, !1);
  }),
  (ldqrBoutonSurprise.prototype.touchEnd = function (e) {
    e.stopPropagation(), e.preventDefault(), window.removeEventListener("mouseup", this, !1), window.removeEventListener("touchend", this, !1);
    var t = "",
      o = "";
    switch (e.type) {
      case "mousedown":
      case "mouseup":
        (t = e.clientX), (o = e.clientY);
        break;
      case "touchstart":
      case "touchend":
        (t = e.changedTouches[0].clientX), (o = e.changedTouches[0].clientY);
        break;
      default:
        break;
    }
    (this.xTap = Math.abs(this.startX - t) < ldqr.TAP_THRESHOLD),
      (this.yTap = Math.abs(this.startY - o) < ldqr.TAP_THRESHOLD),
      this.xTap && this.yTap && (e.stopPropagation(), e.preventDefault(), this.setAction());
  }),
  (ldqrBoutonSurprise.prototype.handleEvent = function (e) {
    switch ((e.stopPropagation(), e.preventDefault(), e.type)) {
      case "mousedown":
      case "touchstart":
        this.touchStart(e);
        break;
      case "mouseup":
      case "touchend":
        this.touchEnd(e);
        break;
      case "keydown":
        break;
    }
  }),
  (ldqrBoutonSurprise.prototype.setAction = function (e) {
    var t = this.el.getAttribute("id"),
      o = document.querySelector("title").getAttribute("id"),
      a = document.getElementById("sonOff"),
      n = document.querySelector("#anime01"),
      s = document.querySelector("#animeFin"),
      i = document.getElementById("menuBas"),
      r = document.getElementById("monTexteAudio"),
      l = document.getElementById("pauseAudio");

    if (s == null) {
      s = n;
    }

    if (
      (r &&
        r.addEventListener("ended", function () {
          l.addClassName("notDisplay");
        }),
      "playAudio" === t || "playTexteSr" === t)
    )
      l.removeClassName("notDisplay"), (r.playbackRate = ldqr.VITESSE_SON_VOIX), r.play();
    else if ("pauseAudio" === t) l.addClassName("notDisplay"), r.pause();
    else if ("btnOnOff2" === t) {
      "p09fig" === o &&
        setTimeout(function () {
          i.removeClassName("notDisplay");
        }, 5500),
        i.addClassName("notDisplay"),
        s &&
          s.addEventListener(
            "endEvent",
            function () {
              i.removeClassName("notDisplay");
            },
            !1
          ),
        document.querySelectorAll(".son-animation").forEach((e) => {
          var t = e.getAttribute("id").split("-");
          t.length > 1 ? "1" === t[1] && ((e.currentTime = 0), e.play()) : ((e.currentTime = 0), e.play());
        }),
        n && n.beginElement();
    } else if ("none" !== a.style.display)
      switch (((a.style.display = "none"), o)) {
        case "page09":
        case "page07":
          (ldqr.SON_GROTTE.currentTime = 0), ldqr.SON_GROTTE.play();
          break;
        case "page14":
          (ldqr.SON_SOURIS.loop = !0), ldqr.SON_SOURIS.play();
          break;
        default:
          break;
      }
    else
      switch (((a.style.display = "inline"), o)) {
        case "page09":
        case "page07":
          ldqr.SON_GROTTE.pause();
          break;
        case "page14":
          ldqr.SON_SOURIS.pause();
          break;
        default:
          break;
      }
  }),
  window.addEventListener(
    "DOMContentLoaded",
    function () {
      window.ldqrController = new ldqrBaseController();
    },
    !1
  );
