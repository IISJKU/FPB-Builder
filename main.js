const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, './js/preload.js')
      }
  })

  win.loadFile('index.html');
  ipcMain.on('setFilePath', () => {
    dialog.showOpenDialog({properties: ['openDirectory ', 'promptToCreate']})
  });
}

app.whenReady().then(() => {
  createWindow();
  
})

