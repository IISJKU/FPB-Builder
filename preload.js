const { ipcRenderer, contextBridge } = require("electron");

//expose all of these main process functions to the renderer in namespace "BRIDGE"
contextBridge.exposeInMainWorld("BRIDGE", {
  desktop: true,
  openImageXHTML() {
    ipcRenderer.send("openImageXHTML");
  },

  narrations() {
    ipcRenderer.send("narrations");
  },

  coverImage() {
    ipcRenderer.send("coverImage");
  },

  otherFiles() {
    ipcRenderer.send("otherFiles");
  },
  setFilePath() {
    ipcRenderer.send("selectDirectory");
  },
  printFilePath() {
    ipcRenderer.send("printDirectory");
  },
  importFile() {
    ipcRenderer.send("importFile");
  },
  generateEpub() {
    ipcRenderer.send("generateEpubs");
  },
  selectNewPage() {
    ipcRenderer.send("generateEpubs");
  },
  importImage() {
    ipcRenderer.send("importImage");
  },
  importDependency() {
    ipcRenderer.send("importDependency");
  },
  onDirectorySet: (callback) => ipcRenderer.on("directorySet", (_event, value) => callback(value)),
});

ipcRenderer.on("filePath", (_event, arg) => {
  console.log(arg);
});
