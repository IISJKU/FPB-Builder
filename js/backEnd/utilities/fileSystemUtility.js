const path = require("path");

let fs = require("fs");

function makeFolder(location, name) {
  fs.mkdirSync(path.join(location, name));
}

function makeFile(location, name, content) {
  fs.writeFileSync(location + name, content);
}

exports.makeFile = makeFile;
exports.makeFolder = makeFolder;
