const { dir } = require("console");
const { app, BrowserWindow } = require("electron");
const path = require("path");
const IpcMainManager = require("./js/backEnd/ipcMainManager.js");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./js/preload.js"),
    },
  });

  win.loadFile("index.html");

  //this registers all of the icpMain Messages, that can be accessed through preload
  //pass it the window, so it has access to the session storage!
  let icpMainManager = new IpcMainManager(win);
};

app.whenReady().then(() => {
  createWindow();
});
