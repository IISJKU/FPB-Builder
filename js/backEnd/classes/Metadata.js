class Metadata {
  constructor() {
    this.title = new Array();
    this.language = new Array();
    this.identifier = new Array();

    //optional
    this.sourceISBN = new Array();
    this.creators = new Array();
    this.authors = new Array();
    this.contributors = new Array();
    this.description = new Array();

    this.copyright = "";
    this.format = "";
    this.publisher = [];
    this.relation = "";
    this.rights = "";
    this.source = "";
    this.subject = "";
    this.type = "";

    //accessibility metadata
    this.accessMode = new Array();
    this.accessibilityModeSufficcient = new Array();
    this.accessibilityFeature = new Array();
    this.accessibilityHazard = new Array();
    this.accessibilitySummary = {};
  }
}

module.exports = Metadata;
