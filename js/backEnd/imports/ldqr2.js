var ldqr = {};
function ldqrBaseController() {
  this.initConfigurables(), this.initComponents(), this.appliqueLocalForage();
}

var numButtons = 5;

function calcNumButtons() {
  for (let i = 0; i < 5; i++) {
    let el = document.getElementById("version0" + (1 + i));

    if (el == null) {
      numButtons = i;
      break;
    }
  }

  console.log("There are " + numButtons + " Buttons.");
}

function play() {
  var start = document.getElementsByClassName("startHere");

  for (let i = 0; i < start.length; i++) {
    var str = start[i].attributes.getNamedItem("begin").value;
    var delay = str.substring(str.lastIndexOf(" "), str.length).replaceAll("s", "");
    delay = parseFloat(delay);
    console.log(delay);

    if (start[i].beginElement) {
      if (delay == 0 || delay == "0") start[i].beginElement();
      else
        setTimeout(() => {
          start[i].beginElement();
        }, delay * 1000);
    }
  }

  var audios = document.getElementsByClassName("son-animation");

  for (var x = 0; x < audios.length; x++) {
    let vol = audios[x].id.split("_")[1];
    if (vol[0] == "0") vol = parseFloat("0." + parseInt(vol));
    console.log(vol);
    audios[x].volume = vol;

    var del = audios[x].id.split("_")[2];
    if (del != "0") del = del[0] + "." + del.substring(1, del.length);
    del = parseFloat(del) * 1000;

    console.log("del");
    console.log(del);
    audios[x].volume = vol;

    let audio = audios[x];

    setTimeout(() => {
      console.log("play audio!");
      audio.play();
    }, del);
  }
}
function initVersionImage() {
  for (var e = ldqr.DEGRES_APERCU, t = e.length, o = 0; o !== t; o++)
    for (var a = document.querySelectorAll("." + e[o]), n = a.length, s = 0; s !== n; s++) a[s].addClassName("notDisplay");
}
function ldqrBoutonBaseController() {
  var mesBoutons = document.querySelectorAll(ldqr.CONTROLE_BOUTON_CSS_SELECTOR),
    mbLength = mesBoutons.length,
    i = mbLength - 1;

  for (; i >= 0; i--) {
    new ldqrBoutonController(mesBoutons[i]);
  }
}
function ldqrBoutonController(element) {
  this.el = element;
  this.el.addEventListener("mousedown", this, { passive: false, capture: false });
  this.el.addEventListener("mouseup", this, { passive: false, capture: false });
  this.el.addEventListener("touchstart", this, { passive: false, capture: false });
  this.el.addEventListener("touchend", this, { passive: false, capture: false });

  // pour a11y
  // this.el.addEventListener("keydown", this, { passive: false, capture: false });
}
/**
 * Description placeholder
 * @date 24/03/2023 - 16:32:28
 *
 * @param {*} d
 */
function activerDesactiverBoutonDYSchoix(d) {
  // console.log(d);
  // check(italiqueBool,grasBool,soulignementBool,muetBool)

  ldqr.DATA_LOCAL_FORAGE.getItem("bouton-dys-active").then(function (dys) {
    if (dys === "activerDYS") {
      document.body.classList.add("dys");
      // check(d[0], d[1], d[2], true);
    } else {
      document.body.classList.remove("dys");
    }
  });
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
    ldqr.VITESSE_SON_VOIX = 1;

    // Init LocalForage pour les sauvegardes
    ldqr.DATA_LOCAL_FORAGE = localforage.createInstance({
      name: "ldqr_emile",
    });
    ldqr.VERSION_IMAGE_EN_COURS = "";
    ldqr.DATA_LOCAL_FORAGE.getItem("def-image").then(function (d) {
      d = d || "version01";
      ldqr.VERSION_IMAGE_EN_COURS = d;
    });
    // classe CSS pour les objets interactifs
    ldqr.CONTROLE_ACTIF_CSS_SELECTOR = ".ldqr-actif";
    // classe CSS pour les boutons de choix
    ldqr.CONTROLE_BOUTON_CSS_SELECTOR = ".svg-bouton,#boutonCouleur,#boutonBW,#boutonVersion";

    // Tap threshold value, in pixels
    ldqr.TAP_THRESHOLD = 10;

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
      limits: 50,
      // Time(milliseconds) to use for animations. Set 0 to remove the animation
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

    // ldqr.DEGRES_APERCU = ["version01", "version02", "version03", "version04", "version05"];
    ldqr.COULEURS_FOND_CSS_CLASS = [
      "ldqr-couleur-fond-blanc",
      "ldqr-couleur-fond-gris",
      "ldqr-couleur-fond-neg",
      "ldqr-couleur-fond-beige",
      "ldqr-couleur-fond-jaune",
    ];

    // noms des classes CSS pour les noms de polices
    // prettier-ignore
    ldqr.FONT_CSS_CLASS = ["ldqr-font-arialblack", "ldqr-font-luciole", "ldqr-font-luciolebold", "ldqr-font-opendyslexicmonospace", "ldqr-font-verdana", "ldqr-font-verdanabold",];
    ldqr.FONT_CASSE_CSS_CLASS = ["ldqr-font-majuscule", "ldqr-font-minuscule"];
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

    ldqr.MON_AD = document.getElementById("maDescriptionAudio");
    ldqr.MON_AUDIO = document.getElementById("monTexteAudio");
    ldqr.PAUSE_AUDIO = document.getElementById("pauseAudio");
    ldqr.PLAY_AUDIO = document.getElementById("playAudio");

    if (ldqr.MON_AUDIO) {
      ldqr.MON_AUDIO.addEventListener(
        "ended",
        function () {
          retourAllOpacity();
          ldqr.PAUSE_AUDIO.classList.add("notDisplay");
        },
        { passive: false, capture: false }
      );
    }
    var retourPage = document.getElementById("lienPage");
    // changement page
    if (retourPage) {
      var fondBlancLienPage = document.getElementById("fondBlancLienPage");
      ldqr.DATA_LOCAL_FORAGE.getItem("home-location").then(function (d) {
        if (d) {
          retourPage.classList.remove("notDisplay");
          retourPage.setAttribute("data-retourPage", d);
          fondBlancLienPage.classList.remove("notDisplay");
        } else {
          retourPage.classList.add("notDisplay");
          fondBlancLienPage.classList.add("notDisplay");
        }
      });
    }
    var zone2texte = document.querySelector("#zone2texte");
    if (zone2texte) {
      var zone2texteDIV = zone2texte.querySelector(".texte");
      var paddingBottom = parseFloat(getComputedStyle(zone2texteDIV, null)["padding-bottom"]);
      var texteClone = document.querySelector("#foreignClone .texte");

      var pageBefore = document.querySelector("#pageBefore");
      var pageAfter = document.querySelector("#pageAfter");
      var pageBeforeXHTML = document.querySelector("#pageBeforeXHTML");
      var pageAfterXHTML = document.querySelector("#pageAfterXHTML");

      var resizeObserver = new ResizeObserver(function (entries) {
        for (var i = 0; i !== entries.length; i++) {
          var entry = entries[i];
          if (entry.contentBoxSize) {
            if (entry.contentBoxSize[0]) {
              var Clone = entries[0].target;

              // NBPAGE = Math.trunc((cloneTaille[1] + NBPAGE * paddingBottom) / z2tHeight);
              NBPAGE = _ajoutDataPage(Clone, zone2texte, zone2texteDIV, paddingBottom);

              // debug.innerHTML = 'NbPage: ' + NBPAGE + ' chatPageSvg: ' + chatPageSvg;

              if (chatPageSvg > NBPAGE) {
                chatPageSvg = NBPAGE;
              }
              _affichepage(pageAfter, pageBefore, chatPageSvg, zone2texteDIV, pageAfterXHTML, pageBeforeXHTML);
            }
          }
        }
      });
      resizeObserver.observe(texteClone);
    }

    /********************* */
    smils = document.querySelectorAll('[data-type="smil"]');

    for (var i = 0; i !== smils.length; i++) {
      var elt = smils[i];

      elt.addEventListener(
        "playoverlay",
        function (e) {
          var interval1 = this.dataset.interval1;
          var interval2 = this.dataset.interval2;
          var index = this.dataset.index;
          var element = this;

          if (interval1 >= ldqr.MON_AUDIO.currentTime * 1000 && !element.classList.contains("notDisplay")) {
            // active
            nIntervId[index] = setTimeout(function () {
              element.classList.add("-epub-media-overlay-active");

              if (element.tagName.toLowerCase() !== "span") {
                triggerMouseEvent(element, "mousedown");
                triggerMouseEvent(element, "mouseup");
              }

              try {
                chatPageSvg = element.children[0].dataset.page;
                _affichepage(pageAfter, pageBefore, chatPageSvg, zone2texteDIV, pageAfterXHTML, pageBeforeXHTML);
              } catch (error) {
                console.log(error);
              }

              // triggerMouseEvent(parent, "click");
            }, interval1 - ldqr.MON_AUDIO.currentTime * 1000);
            // retire
          }
          if (interval2 >= ldqr.MON_AUDIO.currentTime * 1000) {
            nIntervId2[index] = setTimeout(function () {
              element.classList.remove("-epub-media-overlay-active");
            }, interval2 - ldqr.MON_AUDIO.currentTime * 1000);
          }
        },
        false
      );
      elt.addEventListener(
        "stopoverlay",
        function (e) {
          console.log("stopOverlay " + nIntervId);
          // clearTimeout(nIntervId[i]);
          // clearTimeout(nIntervId2[i]);
        },
        false
      );
    }

    // Bouton description
    var text = document.getElementById("groupeImage");
    ldqr.MON_AD = document.getElementById("maDescriptionAudio");
    if (ldqr.MON_AD) {
      ldqr.MON_AD.addEventListener(
        "ended",
        function (e) {
          var pause = document.getElementById("pauseDescription");
          pause.classList.add("notDisplay");
        },
        false
      );
    }
    if (text) {
      if (ldqr.IS_SPEECHSYNTHESIS && !ldqr.MON_AD) {
        text = text.getAttribute("aria-label");
        var pauseDescription = document.getElementById("pauseDescription");
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.lang = "fr-FR";
        var controls = ["playDescription", "pauseDescription"];
        speechSynthesis.cancel();
        utterance.paused = false;
        for (var i = 0; i < controls.length; i++) {
          var control = controls[i];
          var button = document.getElementById(control);
          button.addEventListener("touchend", speak, true);
          button.addEventListener("mouseup", speak, true);
          // button.addEventListener('click', speak, true);
        }

        function speak(e) {
          e.preventDefault();
          var tts = this.id;

          switch (tts) {
            case "playDescription":
              utterance.paused ? speechSynthesis.resume() : speechSynthesis.speak(utterance);
              break;

            case "pauseDescription":
              speechSynthesis.pause();
              utterance.paused = true;
              break;

            case "stop":
              speechSynthesis.cancel();
              utterance.paused = false;
              break;

            default:
              console.log("Eh merde. Ça a buggé.");
          }
        }

        utterance.onend = function (e) {
          pauseDescription.classList.add("notDisplay");

          utterance.paused = false; // Back to default
        };
        utterance.onboundary = function (event) {
          console.log(event);
        };
      } else if (!ldqr.IS_SPEECHSYNTHESIS && !ldqr.MON_AD) {
        var maDescriptionPlay = document.getElementById("maDescriptionPlay");
        var fondMaDescriptionPlay = document.getElementById("fondMaDescriptionPlay");
        if (maDescriptionPlay) {
          maDescriptionPlay.remove();
          fondMaDescriptionPlay.remove();
        }
      }
    }

    NBPAGE = 0;
    var monAudio = document.getElementById("player");
    if (monAudio) {
      // monAudio.playbackRate = 1.2;
      monAudio.pause();
    }

    // Touch SVG retire opacité si pas actif et replace opacity1 si existe
    var mesSvg = document.querySelectorAll("svg");
    for (var i = 0; i !== mesSvg.length; i++) {
      mesSvg[i].addEventListener("mousedown", EventElementStart, { passive: false, capture: false });
      mesSvg[i].addEventListener("mouseup", EventElementEnd, { passive: false, capture: false });
      mesSvg[i].addEventListener("touchstart", EventElementStart, { passive: false, capture: false });
      mesSvg[i].addEventListener("touchend", EventElementEnd, { passive: false, capture: false });
      // pour a11y
      // mesSvg[i].addEventListener("keydown", EventElementStart, { passive: false, capture: false });

      function EventElementStart(e) {
        e.preventDefault();
        e.stopPropagation();
      }
      function EventElementEnd(e) {
        console.log("SVG touche end");
        e.preventDefault();
        e.stopPropagation();
        retourAllOpacity();
      }
    }
  }),
  (ldqrBaseController.prototype.initComponents = function () {
    this.boutonsChoix = new ldqrBoutonBaseController();
    this.boutonsSurprise = new ldqrBoutonBaseSurprise();
    this.svgAction = new ldqrSvgBaseController();
  }),
  (ldqrBaseController.prototype.appliqueLocalForage = function () {
    // applique style bouton play

    // applique la font
    ldqr.DATA_LOCAL_FORAGE.getItem("font-name").then(function (d) {
      d = d || "choixLucioleBold";

      new choixFontName(d);
    });
    // applique la casse
    ldqr.DATA_LOCAL_FORAGE.getItem("font-casse").then(function (d) {
      d = d || "activerMinuscule";

      new activerMajuscule(d);
    });

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

      new activerDesactiverBoutonVersion(d);
    });
    ldqr.DATA_LOCAL_FORAGE.getItem("bouton-couleur-active").then(function (d) {
      d = d || "activerCouleurImage";

      new activerDesactiverBoutonCouleur(d);
    });
    ldqr.DATA_LOCAL_FORAGE.getItem("bouton-dys-active").then(function (d) {
      d = d || "desactiverDYS";

      new activerDesactiverBoutonDYS(d);
    });
    ldqr.DATA_LOCAL_FORAGE.getItem("bouton-audio-active").then(function (d) {
      d = d || "activerAudio";

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
    //
    //   ldqr.VITESSE_DOUBLE_TAPE= d;
    //   var vitesseVal = document.getElementById("dblTapeVal");
    //   var txtVitesse = vitesseVal && vitesseVal.querySelector("text");
    //
    //   txtVitesse && (txtVitesse.innerHTML = d);
    // });
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
  (ldqrBoutonController.prototype.setLocalForage = function (event) {
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
    } else if (eltId === "boutonsCouleurImage") {
      new switchColor();
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
  }),
  (ldqrBoutonController.prototype.handleEvent = function (event) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event.type);

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
    }
  }),
  (ldqrSvgBaseController.prototype.initSvgPanZoom = function () {
    var svgPanZoom = {};
    var zoomEltDiv = document.querySelector(ldqr.ZOOM_ELEMENT_ZONE_CSS_SELECTOR);

    var zoomElt = zoomEltDiv.querySelector("svg");
    svgPanZoom.panZoom = new SVGPanZoom(zoomElt, ldqr.ZOOM_OPTIONS);
    svgPanZoom.zoomElt = zoomElt;
    svgPanZoom.zoomEltDiv = zoomEltDiv;
    this.SVGPanZoom = svgPanZoom;
  }),
  (ldqrSvgBaseController.prototype.initCloseButton = function (e) {
    var t = this.SVGPanZoom.zoomEltDiv,
      o = this.SVGPanZoom.zoomElt,
      a = t.querySelector(".close-bouton");
    if (a)
      for (var n = ["touchstart", "mousedown"], s = 0; s != n.length; s++)
        a.addEventListener(n[s], function (e) {
          e.stopPropagation();
          e.preventDefault();
          (o.innerHTML = ""), t.addClassName("notDisplay");
          retourAllOpacity();
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

/**
 * Description placeholder
 * @date 24/03/2023 - 16:32:28
 *
 * @param {*} el
 * @param {*} SVGPanZoom
 */
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

function choixFontName(d) {
  var texte = document.querySelectorAll("#monTexte,text");

  if (!texte) return;

  console.log(d);

  var elt = document.getElementById(d);
  if (!elt) elt = document.getElementById("Luciole");

  var className = "";
  var bold = false;
  switch (d) {
    case "VerdanaBold":
      className = "ldqr-font-verdanabold";
      break;
    case "Verdana":
      className = "ldqr-font-verdana";
      break;
    case "OpenDyslexicmonospace":
      className = "ldqr-font-opendyslexicmonospace";
      break;
    case "LucioleBold":
      className = "ldqr-font-luciolebold";
      break;
    case "Luciole":
      className = "ldqr-font-luciole";
      break;
    case "ArialBlack":
      className = "ldqr-font-arialblack";
      break;
    default:
      break;
  }

  console.log(className);

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
function appliqueChecked(el, ensemble) {
  var bouton1 = document.querySelector(".bouton-choix-police");
  var bouton2 = document.querySelector(".couleur-fond");
  if (ensemble !== ".def-image") {
    if (!bouton1) return;
    if (!bouton2) return;
  }
  var mesBoutons = document.querySelectorAll(ensemble),
    mesBoutonsLength = mesBoutons.length,
    i;
  for (i = 0; i !== mesBoutonsLength; i++) {
    mesBoutons[i].setAttribute("aria-checked", "false");
    mesBoutons[i].classList.add("unchecked");
    mesBoutons[i].classList.remove("checked");
    mesBoutons[i].tabIndex = -1;
  }
  el.setAttribute("aria-checked", "true");
  el.classList.add("checked");
  el.classList.remove("unchecked");
  el.tabIndex = 0;
  // el.focus();
}
function choixVersionImage(d) {
  ldqr.VERSION_IMAGE_EN_COURS = d;
  var defImage = document.querySelector(".def-image");
  if (!defImage) return;
  retourAllOpacity();
  // initVersionImage();
  var chiffres = {
    version01: "chiffre1",
    version02: "chiffre2",
    version03: "chiffre3",
    version04: "chiffre4",
    version05: "chiffre5",
  };
  var keys = Object.keys(chiffres);
  for (var i = 0; i !== keys.length; i++) {
    if (d === keys[i]) {
      document.getElementById(chiffres[d]) && document.getElementById(chiffres[d]).classList.remove("notDisplay");
    } else {
      document.getElementById(chiffres[keys[i]]) && document.getElementById(chiffres[keys[i]]).classList.add("notDisplay");
    }
  }

  var elt = document.getElementById(d);

  // boutonVersion.childNodes[3].innerHTML = elt.childNodes[3].innerHTML;
  appliqueChecked(elt, ".def-image");

  var mesVersions = document.querySelectorAll("[class*=version0]"),
    mesVersionsLength = mesVersions.length,
    i;
  for (i = 0; i !== mesVersionsLength; i++) {
    mesVersions[i].classList.add("notDisplay");
    if (mesVersions[i].classList.contains(d)) mesVersions[i].classList.remove("notDisplay");
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

  appliqueChecked(elt, ".bouton-couleur-active");
  var fondBlanc = document.getElementById("fondBlancBoutonCouleur");
  var bouton = document.getElementById("boutonsCouleurImage");
  if (!fondBlanc || !bouton) return;

  if (d === "desactiverCouleurImage") {
    // fondBlanc.classList.add("notDisplay");
    // bouton.classList.add("notDisplay");
    fondBlanc.remove();
    bouton.remove();
  }
  // else {
  //   fondBlanc.classList.remove("notDisplay");
  //   bouton.classList.remove("notDisplay");
  // }
  // menuBasTest();
}
function menuBasTest() {}
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
  console.log("activier!");
  console.log(d);
  var elt = document.getElementById(d);
  console.log(elt);
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
function affichagePageMenu(id) {
  var maConfig;
  var page_accueil = document.getElementById("Accueil");
  var affiche = false;

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

function switchColor() {
  var d = "boutonsCouleurImage";
  console.log("t");
  var col = document.getElementById(d);
  var boutonCouleur = document.getElementById("boutonCouleur");

  if (boutonCouleur.ariaChecked == "false") {
    choixCouleurImage("boutonCouleur");
    col.ariaChecked = "true";
  } else {
    d.ariaLabel = "";
    choixCouleurImage("boutonBW");
    col.ariaChecked = "false";
  }

  choixVersionImage00();
}

function choixCouleurImage(d) {
  // var groupeImage = document.getElementById("groupeImage");
  // if (!groupeImage) {
  //   return;
  // }
  var elt = document.getElementById(d);
  var boutonBW = document.getElementById("boutonBW");
  var boutonCouleur = document.getElementById("boutonCouleur");
  // var zoom = document.querySelector(".zoomElt");
  // var cloneZone = document.getElementById('cloneZone');
  // // elt.setAttribute('aria-hidden',"true");

  elt && elt.classList.add("notDisplay");

  switch (d) {
    case "boutonCouleur":
    case "imagesCouleur":
      boutonBW && boutonBW.classList.remove("notDisplay");
      // groupeImage.classList.remove("nb");
      // zoom.classList.remove("nb");
      // cloneZone && cloneZone.classList.remove("nb");

      boutonCouleur.ariaChecked = "true";
      boutonBW.ariaChecked = "false";

      document.body.classList.remove("nb");
      break;
    case "boutonBW":
    case "imagesNB":
      document.body.classList.add("nb");
      boutonCouleur && boutonCouleur.classList.remove("notDisplay");
      boutonCouleur.ariaChecked = "false";
      boutonBW.ariaChecked = "true";
      // groupeImage.classList.add("nb");
      // zoom.classList.add("nb");
      // cloneZone && cloneZone.classList.add("nb");

      break;
    case "imagesNeg":
      break;
    default:
      break;
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

/**
 * Revient à une image sans mise en évidence
 */
function retourAllOpacity() {
  var x = document.querySelectorAll(".opacity02");

  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("opacity02");
  }

  var y = document.querySelectorAll("opacity01");

  for (var i = 0; i < y.length; i++) {
    y[i].classList.remove("opacity01");
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
function triggerMouseEvent(node, eventType) {
  var clickEvent = new MouseEvent(eventType, {
    view: window,
    bubbles: false,
    cancelable: true,
  });

  node.dispatchEvent(clickEvent);
}
function RadioGroup(groupNode) {
  this.groupNode = groupNode;

  this.radioButtons = [];

  this.firstRadioButton = null;
  this.lastRadioButton = null;

  var rbs = this.groupNode.querySelectorAll('[role="radio"],[role="menuitemradio"]');

  for (var i = 0; i < rbs.length; i++) {
    var rb = rbs[i];

    rb.addEventListener("keydown", this.handleKeydown.bind(this));
    rb.addEventListener("click", this.handleClick.bind(this));
    rb.addEventListener("focus", this.handleFocus.bind(this));
    rb.addEventListener("blur", this.handleBlur.bind(this));

    this.radioButtons.push(rb);

    if (!this.firstRadioButton) {
      this.firstRadioButton = rb;
    }
    this.lastRadioButton = rb;
  }
}

RadioGroup.prototype.setChecked = function (currentItem) {
  console.log(this.radioButtons);
  console.log(currentItem);
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    rb.setAttribute("aria-checked", "false");
    rb.classList.remove("checked");
    rb.classList.add("unchecked");
    rb.tabIndex = -1;
  }
  currentItem.setAttribute("aria-checked", "true");
  currentItem.classList.add("checked");
  currentItem.classList.remove("unchecked");
  triggerMouseEvent(currentItem, "mousedown");
  triggerMouseEvent(currentItem, "mouseup");

  currentItem.tabIndex = 0;
  currentItem.focus();
};

RadioGroup.prototype.setCheckedToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstRadioButton) {
    this.setChecked(this.lastRadioButton);
  } else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index - 1]);
  }
};

RadioGroup.prototype.setCheckedToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastRadioButton) {
    this.setChecked(this.firstRadioButton);
  } else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index + 1]);
  }
};

/* EVENT HANDLERS */

RadioGroup.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false;
  console.log(event.key, event.target);

  switch (event.key) {
    case " ":
      this.setChecked(tgt);
      flag = true;
      break;

    case "Up":
    case "ArrowUp":
    case "Left":
    case "ArrowLeft":
      this.setCheckedToPreviousItem(tgt);
      flag = true;
      break;

    case "Down":
    case "ArrowDown":
    case "Right":
    case "ArrowRight":
      this.setCheckedToNextItem(tgt);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

RadioGroup.prototype.handleClick = function (event) {
  this.setChecked(event.currentTarget);
};

RadioGroup.prototype.handleFocus = function (event) {
  // event.currentTarget.classList.add('focus');
};

RadioGroup.prototype.handleBlur = function (event) {
  // event.currentTarget.classList.remove('focus');
};

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
    var element = this.el;
    var monId = element.getAttribute("id");
    var maPage = document.querySelector("title").getAttribute("id");

    var monAnim = document.querySelector("#anime1");
    var monAnimFin = document.querySelector("#animeFin");
    var menuBas = document.getElementById("menuBas");
    var menuHaut = document.getElementById("menuHaut");
    // var monAudio = document.getElementById("monTexteAudio");
    var playDescription = document.getElementById("playDescription");
    var pauseDescription = document.getElementById("pauseDescription");
    // monAudio &&
    //   monAudio.addEventListener("ended", function () {
    //     retourAllOpacity();
    //     ldqr.PAUSE_AUDIO.classList.add("notDisplay");
    //   }, { passive: false, capture: false });
    if (element.dataset.pageturn) {
      window.location.href = element.dataset.pageturn;
    }
    var zone2texteDIV = document.querySelector("#zone2texte .texte");
    var pageBefore = document.querySelector("#pageBefore");
    var pageAfter = document.querySelector("#pageAfter");
    var pageBeforeXHTML = document.querySelector("#pageBeforeXHTML");
    var pageAfterXHTML = document.querySelector("#pageAfterXHTML");
    switch (monId) {
      case "lienPage":
        window.location.href = element.dataset.retourPage;
        break;
      case "resultat":
        var bonneRVal = document.querySelector("[data-reponse]");
        bonneRVal = bonneRVal.dataset.reponse;
        var proposition = document.querySelectorAll("[data-proposition]");
        for (var i = 0; i !== proposition.length; i++) {
          var val = proposition[i].dataset.proposition;
          if (val === bonneRVal) {
            proposition[i].classList.add("bonne-reponse");
            element.setAttribute("aria-label", "La bonne réponse est " + proposition[i].textContent);
          } else {
            proposition[i].classList.add("mauvaise-reponse");
          }
        }
        break;
      case "boutonHome":
        ldqr.DATA_LOCAL_FORAGE.setItem("home-location", window.location.href.split("/").pop()).then(function (d) {
          window.location.href = "page00.xhtml#Accueil";
        });
        break;
      case "pageAfter":
        chatPageSvg++;

        if (chatPageSvg > NBPAGE) {
          // chatPageSvg = NBPAGE;
          element.classList.add("notDisplay");
        } else {
          element.classList.remove("notDisplay");
          _affichepage(pageAfter, pageBefore, chatPageSvg, zone2texteDIV, pageAfterXHTML, pageBeforeXHTML);
        }
        break;
      case "pageBefore":
        chatPageSvg--;

        if (chatPageSvg < 0) {
          // chatPageSvg = 0;
          element.classList.add("notDisplay");
        } else {
          element.classList.remove("notDisplay");
          _affichepage(pageAfter, pageBefore, chatPageSvg, zone2texteDIV, pageAfterXHTML, pageBeforeXHTML);
        }
        break;
      case "btnBulleOnOff":
        var barre = element.querySelector("#croixBulle");
        barre.classList.toggle("notDisplay");

        afficheBulles(true);

        break;
      case "playAudio":
      case "playTexteSr":
        if (ldqr.PAUSE_AUDIO) {
          ldqr.PAUSE_AUDIO.classList.remove("notDisplay");
          ldqr.PAUSE_AUDIO.setAttribute("tabindex", 0);
          ldqr.PAUSE_AUDIO.focus();
          element.setAttribute("tabindex", -1);
        }

        if (ldqr.MON_AUDIO) {
          ldqr.MON_AUDIO.playbackRate = ldqr.VITESSE_SON_VOIX;

          ldqr.MON_AUDIO.play(false);
          for (var i = 0; i !== smils.length; i++) {
            triggerMouseEvent(smils[i], "playoverlay");
          }
        }
        break;
      case "pauseAudio":
        ldqr.PAUSE_AUDIO.classList.add("notDisplay");
        ldqr.PLAY_AUDIO.setAttribute("tabindex", 0);
        ldqr.PLAY_AUDIO.focus();
        element.setAttribute("tabindex", -1);
        ldqr.MON_AUDIO && ldqr.MON_AUDIO.pause();
        for (var i = 0; i !== smils.length; i++) {
          clearTimeout(nIntervId[i]);
          clearTimeout(nIntervId2[i]);
        }

        break;
      case "playCoverNarration":
        if (ldqr.MON_AUDIO) {
          if (!ldqr.MON_AUDIO.paused && !ldqr.MON_AUDIO.ended) {
            ldqr.MON_AUDIO.pause();
            ldqr.MON_AUDIO.currentTime = 0;
            console.log("pause");
          } else {
            ldqr.MON_AUDIO.playbackRate = ldqr.VITESSE_SON_VOIX;
            ldqr.MON_AUDIO.play();
          }
        }
        break;
      case "playDescription":
        if (ldqr.MON_AD) {
          ldqr.MON_AD.play();
        }
        pauseDescription.classList.remove("notDisplay");

        break;
      case "pauseDescription":
        if (ldqr.MON_AD) {
          ldqr.MON_AD.pause();
        }
        pauseDescription.classList.add("notDisplay");

        break;
      case "btnOnOff2":
        if (element.classList.contains("notDisplay")) {
          return;
        }
        switch (maPage) {
          case "page09fig":
            setTimeout(function () {
              menuBas.classList.remove("notDisplay");
              menuHaut.classList.remove("notDisplay");
            }, 5500);
            break;
          case "page12fig":
            var nuitJour = document.querySelectorAll(".jour-nuit");
            for (var i = 0; i < nuitJour.length; i++) {
              nuitJour[i].classList.toggle("notDisplay");
            }
            var mesSonsAnimations = document.querySelectorAll(".son-animation");
            for (var j = 0; j !== mesSonsAnimations.length; j++) {
              var s = mesSonsAnimations[j];
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
            }

            return;
            break;

          default:
            break;
        }
        menuBas.classList.add("notDisplay");
        menuHaut.classList.add("notDisplay");
        afficheBulles(false);
        retourAllOpacity();
        var body = document.querySelector("body");
        body.classList.add("no-event");

        if (monAnimFin) {
          monAnimFin.addEventListener(
            "endEvent",
            function () {
              menuBas.classList.remove("notDisplay");
              menuHaut.classList.remove("notDisplay");
              body.classList.remove("no-event");

              ldqr.ACTIVER_BULLE && afficheBulles(true);
            },
            { passive: false, capture: false }
          );
        } else {
          monAnim &&
            monAnim.addEventListener(
              "endEvent",
              function () {
                menuBas.classList.remove("notDisplay");
                body.classList.remove("no-event");

                ldqr.ACTIVER_BULLE && afficheBulles(true);
              },
              { passive: false, capture: false }
            );
        }

        var mesSonsAnimations = document.querySelectorAll(".son-animation");
        for (var j = 0; j !== mesSonsAnimations.length; j++) {
          var s = mesSonsAnimations[j];
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
        }

        monAnim && monAnim.beginElement();

        break;
    }
  }),
  window.addEventListener(
    "DOMContentLoaded",
    function () {
      calcNumButtons();
      window.ldqrController = new ldqrBaseController();

      console.log("i get triggered!!");
      var radioGroupes = document.querySelectorAll('[role="radiogroup"],[role="menuitem"]');
      var rgLength = radioGroupes.length;
      i = rgLength - 1;
      for (; i >= 0; i--) {
        new RadioGroup(radioGroupes[i]);
      }

      var buttons = document.querySelectorAll('[role="button"],[role="menuitem"]');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener(
          "keydown",
          function (e) {
            if (e.code === "Enter" || e.code === "Space") {
              triggerMouseEvent(this, "mousedown");
              triggerMouseEvent(this, "mouseup");
            }
          },
          false
        );
      }

      var colorButton = document.getElementById("boutonsCouleurImage");

      if (colorButton) {
        colorButton.addEventListener("keydown", (e) => {
          console.log(e.key);
          if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "Enter") switchColor();
        });
      }

      var playButtn = document.getElementById("btnOnOff2");
      console.log(playButtn);
      console.log("playButtn");
      if (playButtn) {
        playButtn.addEventListener("keydown", (e) => {
          console.log(e.key);
          if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "Enter") play();
        });
      }

      var boutonsAllVersion = document.getElementById("boutonsAllVersion");
      var boutonVersion = document.getElementById("boutonVersion");
      var menuBas = document.getElementById("menuBas");
      if (menuBas) {
        boutonsAllVersion &&
          boutonsAllVersion.addEventListener(
            "focusin",
            function (e) {
              if (!boutonVersion.classList.contains("notDisplay")) {
                if (menuBas.classList.contains("bas")) {
                  triggerMouseEvent(boutonVersion, "mousedown");
                  triggerMouseEvent(boutonVersion, "mouseup");
                }
              }
            },
            false
          );
        boutonsAllVersion &&
          boutonsAllVersion.addEventListener(
            "focusout",
            function (e) {
              if (!boutonVersion.classList.contains("notDisplay")) {
                if (menuBas.classList.contains("haut")) {
                  triggerMouseEvent(boutonVersion, "mousedown");
                  triggerMouseEvent(boutonVersion, "mouseup");
                }
              }
            },
            false
          );
      }
    },
    !1
  );
