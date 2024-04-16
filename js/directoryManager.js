//executes when DOM is loaded
$(document).ready(function () {
  //select deom elements with "setFilepath" class and add onClick functionality
  //this opens talks to the main process through the namespace "BRIDGE"
  $(".selectDirectory").on("click", () => {
    BRIDGE.setFilePath();
  });

  $(".printDirectory").on("click", () => {
    BRIDGE.printFilePath();
  });

  $(".generateTestFiles").on("click", () => {
    BRIDGE.generateTestFiles();
  });
  $(".importFile").on("click", () => {
    BRIDGE.importFile();
  });
  $(".generateEpub").on("click", () => {
    BRIDGE.generateEpub();
  });
  $(".selectFigureXHTML").on("click", () => {
    BRIDGE.generateEpub();
  });
  $(".importImage").on("click", () => {
    BRIDGE.importImage();
  });
  $(".importDependency").on("click", () => {
    BRIDGE.importDependency();
  });
});
