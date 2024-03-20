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

  for (let i = 0; i < end; i++) {
    newPath = newPath + string.charAt(i);
  }

  return newPath;
}

function getAbsolutePath(ogFilePath, path) {
  let temp = "";

  let newPath = "";

  //cuts off the filename from original path
  newPath = cutEnd(ogFilePath);

  //cut off everything before name of new file
  //caution: this breaks if there is a slash at the end, which is actually unlikely :P
  temp = path.trim();

  //if the path jumps directory, we need to change the absolute path accordingly
  while (temp.includes("../")) {
    newPath = cutEnd(newPath);

    //cut the ../ signifier if it is at the start
    if (temp.substring(0, 3) == "../") {
      temp = temp.substring(3, temp.length);
    }
  }

  if (temp.substring(0, 1) == "./") {
    //this cuts of the signifier that it is in the same dir as the selected file
    temp = temp.replaceAll("./", "");
  }

  newPath = newPath + "\\" + temp;
  newPath = newPath.replaceAll("/", "\\");

  return newPath;
}

exports.cutEnd = cutEnd;
exports.getAbsolutePath = getAbsolutePath;
exports.cutOutFilename = cutOutFilename;
