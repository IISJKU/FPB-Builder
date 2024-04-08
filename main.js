const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { report } = require('node:process');
const path = require('node:path');

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

ipcMain.on("openImageXHTML", () => {
    dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{
            name: 'xhtml Image', extensions: ['xhtml']
          }]
    })
});

ipcMain.on("narrations", () => {
    dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{
            name: 'Audio', extensions: ['wav', 'mp3']
          }]
    })
});

ipcMain.on("coverImage", () => {
    //handleFileOpen();
    dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{
            name: 'Images', extensions: ['jpg', 'png', 'jpeg']
          }]
    }).then(result => {
       // mainWindow.webContents.send('asynchronous-message', {'SAVED': 'File Saved'});
        console.log(result.canceled)
        console.log(report.filePaths)
      }).catch(err => {
        console.log(err)
      })
});

ipcMain.on("otherFiles", () => {
    dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{
            name: 'All Files', extensions: ['*']
          }]
    })
});



