const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { report } = require("node:process");
const path = require("node:path");
const IpcMainManager = require("./js/backEnd/ipcMainManager.js");
const ProjectData = require("./js/backend/classes/ProjectData.js");
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

  //calling the constructor automatically regesters all of the icpMain events
  let icpMainManager = new IpcMainManager(mainWindow);

  //comment this out, if it annoys you!
  mainWindow.on("close", function (e) {
    const choice = require("electron").dialog.showMessageBoxSync(this, {
      type: "warning",
      buttons: ["Yes", "No"],
      title: "Confirm",
      message: "You have unsaved changes. Save before quitting?",
    });
    if (choice === 0) {
      e.preventDefault();
      let dir = app.getPath("userData") + "\\projects\\";
      let project = new ProjectData();

      project.fillWithTestData();
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFileSync(dir + project.name + ".json", JSON.stringify(project));
      console.log(app.getPath("userData"));
    }
  });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("recentProjectsLoaded", loadRecentProjects());
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
  let projects = fs.readdirSync(app.getPath("userData") + "\\projects\\");
  console.log(app.getPath("userData") + "\\projects\\");
  let loadedProjects = new Array();

  if (Array.isArray(projects)) {
    projects.forEach((project) => {
      console.log(JSON.parse(fs.readFileSync(app.getPath("userData") + "\\projects\\" + project, { encoding: "utf8" })).name);
      loadedProjects.push(JSON.parse(fs.readFileSync(app.getPath("userData") + "\\projects\\" + project, { encoding: "utf8" })));
    });
  }

  //projects.toString()
  return loadedProjects;
}
