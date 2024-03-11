const { dir } = require('console');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
let fs = require('fs');

let selectedDirectory = null;


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, './js/preload.js')
      }
  })

  win.loadFile('index.html');


  //TODO    
  //Move these to a different file to keep this one clean!

  //sets up a function that lets the user pick a path from the file explorer
  ipcMain.on('selectDirectory', () => {
    selectedDirectory = dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    //lets the user print the filepath to console 
    ipcMain.on('printDirectory', () => {
        if(selectedDirectory != null){
            //dialog.showOpenDialog returns promise object, so we have to do it like this
            selectedDirectory.then((value) => {
                console.log(value['filePaths'][0]);
            });
        }
    });

    //Here, the Files will be generated, this is still under construction!
    ipcMain.on('generateTestFiles', () => {
        selectedDirectory.then((value) => {
            fs.writeFile(value['filePaths'][0] + '/mynewfile3.txt', 'Hello content!', function (err) {
                if (err) throw err;

                console.log('Saved!');
            });

            fs.mkdir(path.join(value['filePaths'][0], 'test'),(err) => {
                if (err) {
                    return console.error(err);
                }
                console.log('Directory created successfully!');
            });
        });
    });


  });

  

}

app.whenReady().then(() => {
  createWindow();
  
})

