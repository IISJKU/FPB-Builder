const { ipcRenderer } = require("electron");
const bootstrap = require('./node_modules/bootstrap/dist/js/bootstrap.bundle.js');
window.$ = window.jquery = require("jquery");

document.addEventListener("DOMContentLoaded", function(e) {
});

window.onload = function(){
  $("#project-tab").load("pages/project.html");
  $("#metadata-tab").load("pages/metadata.html");
  $("#publish-tab").load("pages/reviewPublish.html");
  $("#about-tab").load("pages/about.html");
}