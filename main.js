const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { report } = require("node:process");
const path = require("node:path");
const IpcMainManager = require("./js/backEnd/ipcMainManager.js");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1290,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("index.html");

  //calling the constructor automatically regesters all of the icpMain events
  let icpMainManager = new IpcMainManager(mainWindow);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("did-finish-load", function () {});
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  // if not macOS
  if (process.platform !== "darwin") app.quit();
});
