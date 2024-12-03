const fs = require("fs");
const pathU = require("path");

//version of the same function, but with an offset!
function cutOutFilename(str, tag) {
  let index = str.indexOf(tag);
  let filename = "";
  let open = false;

  //itterate through string after href/src tag, if it is in between quotes, it will be added to filename
  for (let i = index; i < str.length; i++) {
    if (str.charAt(i) == '"' || str.charAt(i) == "'") {
      if (open) {
        i = str.length;
        break;
      } else {
        open = true;
      }
    } else {
      //only add to filename if in between quotes
      if (open) {
        filename = filename + str.charAt(i);
      }
    }
  }

  return filename;
}

function cutEnd(string) {
  let newPath = "";
  let end = string.lastIndexOf("\\");

  if (string.includes("/")) end = string.lastIndexOf("/");

  for (let i = 0; i < end; i++) {
    newPath = newPath + string.charAt(i);
  }

  return newPath;
}

function getAbsolutePath(ogFilePath, path) {
  let oPath = ogFilePath;
  if(ogFilePath.includes(".")) oPath = ogFilePath.substring(0, ogFilePath.lastIndexOf(pathU.sep));
  newPath = pathU.resolve(oPath, path); // adapt to operating system

  newPath = pathU.normalize(newPath);
  
  return newPath;
}

exports.cutEnd = cutEnd;
exports.getAbsolutePath = getAbsolutePath;
exports.cutOutFilename = cutOutFilename;
