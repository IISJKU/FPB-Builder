const {ipcRenderer, contextBridge} = require('electron');

//expose all of these main process functions to the renderer in namespace "BRIDGE"
contextBridge.exposeInMainWorld('BRIDGE', {
  setFilePath() {
    ipcRenderer.send('selectDirectory');
  }, 
  printFilePath() {
    ipcRenderer.send('printDirectory');
  },
  generateTestFiles() {
    ipcRenderer.send('generateTestFiles');
  },
});
