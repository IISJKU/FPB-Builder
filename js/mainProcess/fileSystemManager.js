const path = require("path");

let fs = require("fs");

function test() {}

function makeFolder(location, name) {
  fs.mkdir(path.join(location, name), (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Folder created at " + location + "\\" + name);
  });
}

function makeFile(location, name, content) {
  fs.writeFile(location + "/" + name, content, function (err) {
    if (err) throw err;

    console.log("Saved!");
  });
}

exports.makeFile = makeFile;
exports.makeFolder = makeFolder;
