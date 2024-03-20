let fs = require("fs");

//reads the menu template and fills in with the right language
function createNotice() {
  let str = "";

  str = fs.readFileSync("./js/backEnd/templates/noticeGer.xhtml", "utf-8");

  return str;
}

exports.createNotice = createNotice;
