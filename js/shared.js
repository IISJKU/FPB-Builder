const { app } = require("electron");
const ProjectData = require("./backEnd/classes/ProjectData.js");
let fs = require("fs");

// write the data in a json file to "AppData\Roaming\fpb-builder\projects" path
async function writeData(window, closeApp){
  window.webContents.executeJavaScript('checkRequired()', true).then( async (result) => {
    if (result == true){
      let dir = app.getPath("userData") + "\\projects\\";
      let project = new ProjectData();
      await project.fillData(window);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFileSync(dir + project.name + ".json", JSON.stringify(project));
      if (closeApp == true) app.exit();
    }else{
      return;
    }
  });
  }
  
// get the project name value and save the data
function saveData(window){
    window.webContents.executeJavaScript('document.getElementById("projName").value', true).then( (name) => {
      if (name == undefined || name == 'undefined' || name == ''){
        return;
      }else{
        writeData(window)
      }
    });
}

exports.writeData = writeData;
exports.saveData = saveData;
