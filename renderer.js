window.$ = window.jquery = $;

document.addEventListener("DOMContentLoaded", function (e) {});

window.onload = function () {
  translationArr();
  $("#project-tab").load("pages/project.html");
  $("#metadata-tab").load("pages/metadata.html");
  $("#publish-tab").load("pages/reviewPublish.html");
  $("#about-tab").load("pages/about.html");
  $("#spine-tab").load("pages/spine.html");
  $("#font-tab").load("pages/font.html");
};
