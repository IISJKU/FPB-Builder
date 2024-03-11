const {ipcRenderer, contextBridge} = require('electron');

//expose "setFilePath" to renderer namespace "BRIDGE"
contextBridge.exposeInMainWorld('BRIDGE', {
  setFilePath() {
    ipcRenderer.send('setFilePath');
  }
});