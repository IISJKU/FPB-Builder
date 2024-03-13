const { dir } = require("console");
const { app, BrowserWindow } = require("electron");
const path = require("path");

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
  //moved to different file for clarity
  //this is ugly, fix this
  require("./js/mainProcess/ipcMainManager.js");
};

app.whenReady().then(() => {
  createWindow();
});
