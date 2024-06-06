const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("node:path");
const IpcMainManager = require("./js/backEnd/ipcMainManager.js");
const shared = require("./js/shared.js");
let fs = require("fs");

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

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          accelerator: 'Ctrl+S',
          click() {
            shared.saveData(mainWindow); }
        },
        { type: 'separator'},
        { role: 'quit', 
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
        },
      ]
    },
  ]
    
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  //calling the constructor automatically registers all of the icpMain events
  let icpMainManager = new IpcMainManager(mainWindow);

  //application on close event check if there is any changes on the data before closing the app
  mainWindow.on("close", async function (event) {
    event.preventDefault();
    mainWindow.webContents.executeJavaScript('document.getElementById("projName").value', true).then( (name) => {
      fs.readFile(app.getPath("userData") + "\\projects\\"+ name+'.json', "utf8",  (err, jsonString) => {
        // if the file is not exist (new project) set the jsonString value to empty to continue saving the new project
        if (err) {
          if (err.code == 'ENOENT' && name != '') {
            jsonString = "";
          }
        }
        if (jsonString == undefined || jsonString == 'undefined'){
          app.exit();
          return;
        }
        mainWindow.webContents.executeJavaScript("compareData("+jsonString+")", true).then( async (equalCheck) => {
          // all objects are equal (no change detected)
          if (equalCheck == 1 ){
            app.exit();
            return;
          }
          const choice = dialog.showMessageBoxSync(this, {
            type: "warning",
            buttons: ["Yes", "No"],
            title: "Confirm",
            message: "You have unsaved changes. Save before quitting?",
          });
          // if the user choose to save the data of the book
          if (choice === 0) {
            event.preventDefault();
            await shared.writeData(mainWindow, true);
          }else{
            app.exit();
          }
        });  
      });
    });
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("did-finish-load", () => {
    //load recent projects list
    mainWindow.webContents.send("recentProjectsLoaded", loadRecentProjects());
    //clear session storage
    mainWindow.webContents.executeJavaScript("rmSessionItem()", true);
    // initialize tabs
    mainWindow.webContents.executeJavaScript("initializeTabs()", true);
    //load app settings
    mainWindow.webContents.send("setAppSettings", loadAppSettings());
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  // if not macOS
  if (process.platform !== "darwin") app.quit();
});

function loadRecentProjects() {
  if (!fs.existsSync(app.getPath("userData") + "\\projects")) {
    fs.mkdirSync(app.getPath("userData") + "\\projects");
  } 
  let projects = fs.readdirSync(app.getPath("userData") + "\\projects\\");
  let loadedProjects = new Array();

  if (Array.isArray(projects)) {
    projects.forEach((project) => {
      loadedProjects.push(JSON.parse(fs.readFileSync(app.getPath("userData") + "\\projects\\" + project, { encoding: "utf8" })));
    });
  }

  //projects.toString()
  return loadedProjects;
}

function loadAppSettings() {
  if (!fs.existsSync(app.getPath("userData") + "\\projects")) {
    fs.mkdirSync(app.getPath("userData") + "\\projects");
  } 
  if (!fs.existsSync(app.getPath("userData") + "\\projects\\appSettings.json")) {
    return null;
  }
  let appSett = JSON.parse(fs.readFileSync(app.getPath("userData") + "\\projects\\appSettings.json", { encoding: "utf8" }))
  return appSett;
}