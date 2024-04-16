const { title } = require("process");

class MetadataErrors {
  titleMissing = [];
  identifierMissing = [];

  accModeMissing = [];
  accFeatureMissing = [];
  accHazardMissing = [];
  accModeSufficcientMissing = [];
  accSummaryMissing = [];

  isEmpty() {
    return (
      this.titleMissing.length == 0 &&
      this.identifierMissing.length == 0 &&
      this.accModeMissing.length == 0 &&
      this.accFeatureMissing.length == 0 &&
      this.accHazardMissing.length == 0 &&
      this.accModeSufficcientMissing.length == 0 &&
      this.accSummaryMissing.length == 0
    );
  }
}

class PageErrors {
  isEmpty() {
    return true;
  }
}

class ErrorList {
  metadata = new MetadataErrors();
  pages = new PageErrors();

  isEmpty() {
    return this.metadata.isEmpty() && this.pages.isEmpty();
  }
}

module.exports = ErrorList;
module.exports.PageErrors = PageErrors;
