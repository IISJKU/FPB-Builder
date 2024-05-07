const { ipcRenderer, contextBridge } = require("electron");

//expose all of these main process functions to the renderer in namespace "BRIDGE"
contextBridge.exposeInMainWorld("BRIDGE", {
  desktop: true,
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
    ipcRenderer.send("openImageXHTML");
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
  loadJSON(name) {
    ipcRenderer.send("loadJSON", name);
  },
  saveDataBtn() {
    ipcRenderer.send("saveDataBtn");
  },
  onDirectorySet: (callback) => ipcRenderer.on("directorySet", (_event, value) => callback(value)),
  //openFile: () => ipcRenderer.invoke("dialog:openFile"),
  onRecentProjectsLoaded: (callback) => ipcRenderer.on("recentProjectsLoaded", (_event, value) => callback(value)),
  onImageLoaded: (callback) => ipcRenderer.on("imageLoaded", (_event, value) => callback(value)),
  onProjectData: (callback) => ipcRenderer.on("projectData", (_event, value) => callback(value)),
});

ipcRenderer.on("filePath", (_event, arg) => {
  console.log(arg);
});