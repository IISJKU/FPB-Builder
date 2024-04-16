class DependencyList {
  foundFiles = new Array();
  missingFiles = new Array();
  isImage = false;

  /**
   * add item to found files. if it is in the list of missing files, it gets removed from it.
   * @param {String} fileName
   */
  found(fileName) {
    if (this.missingFiles.includes(fileName)) {
      this.missingFiles.splice(this.missingFiles.indexOf(fileName), 1);
    }
    this.foundFiles.push(fileName);
  }
  /**
   * add item to missing files. if it is in the list of found files, it gets removed it gets removed from it.
   * @param {String} fileName
   */
  missing(fileName) {
    if (this.foundFiles.includes(fileName)) {
      this.foundFiles.splice(this.foundFiles.indexOf(fileName), 1);
    }
    this.missingFiles.push(fileName);
  }
}

module.exports = DependencyList;
