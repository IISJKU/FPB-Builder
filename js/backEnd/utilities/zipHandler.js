const archiver = require("archiver");
//var FileSaver = require("file-saver");
let fs = require("fs");

function makeEPUB(path) {
  //zip.file(path + "mimetype");
  const archive = archiver("zip", { zlib: { level: 0 } });
  const stream = fs.createWriteStream(path.substring(0, path.lastIndexOf("\\")) + ".zip");

  console.log(path.substring(0, path.lastIndexOf("\\")));

  return new Promise((resolve, reject) => {
    archive
      .append("application/epub+zip", { name: "mimetype" })
      .directory(path, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
}

exports.makeEPUB = makeEPUB;
