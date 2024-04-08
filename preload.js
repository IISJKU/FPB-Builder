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

});
