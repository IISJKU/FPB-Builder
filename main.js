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

    ipcMain.on("openImageXHTML", (event, arg) => {
        dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [{
                name: 'xhtml Image', extensions: ['xhtml']
            }]
        }).then(result => {
            event.reply('filePath', result.filePaths);
        }).catch(err => {
            console.log(err)
        })
    });

    ipcMain.on("narrations", (event, arg) => {
        dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [{
                name: 'Audio', extensions: ['wav', 'mp3']
            }]
        }).then(result => {
            event.reply('filePath', result.filePaths);
        }).catch(err => {
            console.log(err)
        })
    });

    ipcMain.on("coverImage", (event, arg) => {
        dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [{
                name: 'Images', extensions: ['jpg', 'png', 'jpeg']
            }]
        }).then(result => {
            event.reply('filePath', result.filePaths);
        }).catch(err => {
            console.log(err)
        })
    });

    ipcMain.on("otherFiles", (event, arg) => {
        dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [{
                name: 'All Files', extensions: ['*']
            }]
        }).then(result => {
            event.reply('filePath', result.filePaths);
        }).catch(err => {
            console.log(err)
        })
    });
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    // if not macOS
    if (process.platform !== 'darwin') app.quit()
})