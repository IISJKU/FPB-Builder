const { ipcRenderer, contextBridge } = require("electron");

//expose all of these main process functions to the renderer in namespace "BRIDGE"
contextBridge.exposeInMainWorld("BRIDGE", {
  desktop: true,
  narrations(defPath, element) {
    ipcRenderer.send("narrations", defPath, element);
  },

  coverImage(defPath) {
    ipcRenderer.send("coverImage", defPath);
  },

  otherFiles(defPath, element) {
    ipcRenderer.send("otherFiles", defPath, element);
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
  importImage(defPath) {
    ipcRenderer.send("importImage", defPath);
  },
  importDependency() {
    ipcRenderer.send("importDependency");
  },
  importDependency2(val) {
    ipcRenderer.send("importDependency2", val);
  },
  loadJSON(name) {
    ipcRenderer.send("loadJSON", name);
  },
  saveDataBtn() {
    ipcRenderer.send("saveDataBtn");
  },
  setFontPath() {
    ipcRenderer.send("selectFont");
  },
  saveSettings(lang) {
    ipcRenderer.send("saveSettings", lang);
  },
  onDirectorySet: (callback) => ipcRenderer.on("directorySet", (_event, value) => callback(value)),
  //openFile: () => ipcRenderer.invoke("dialog:openFile"),
  onRecentProjectsLoaded: (callback) => ipcRenderer.on("recentProjectsLoaded", (_event, value) => callback(value)),
  onImageLoaded: (callback) => ipcRenderer.on("imageLoaded", (_event, value) => callback(value)),
  onProjectData: (callback) => ipcRenderer.on("projectData", (_event, value) => callback(value)),
  onPublishUpdate: (callback) => ipcRenderer.on("publishUpdate", (_event, value) => callback(value)),
  onFontSet: (callback) => ipcRenderer.on("fontSet", (_event, value) => callback(value)),
  onNarrationLoaded: (callback) => ipcRenderer.on("narrationLoaded", (_event, value, elementId) => callback(value, elementId)),
  onSetPath: (callback) => ipcRenderer.on("setPath", (_event, value, elementId) => callback(value, elementId)),
  onSetAppSettings: (callback) => ipcRenderer.on("setAppSettings", (_event, value) => callback(value)),
  onPublishSuccessful: (callback) => ipcRenderer.on("publishSuccessful", (_event, value) => callback(value)),
});
