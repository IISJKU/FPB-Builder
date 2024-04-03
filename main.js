const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { report } = require('node:process');
const path = require('node:path');

//report.writeReport();
ipcMain.on("openImageXHTML", () => {
    dialog.showOpenDialog({
        properties: ["file"],
      })
  });

const createWindow = () => {
    const mainWindow =  new BrowserWindow({
        width: 1290,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        }
    })

    mainWindow.loadFile('index.html');
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
    mainWindow.webContents.on('did-finish-load', function() {
        
    });
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    // if not macOS
    if (process.platform !== 'darwin') app.quit()
})


