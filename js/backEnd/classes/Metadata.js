class Metadata {
  constructor() {
    this.title = new Array();
    this.language = new Array();
    this.identifier = new Array();

    //optional
    this.creators = new Array();
    this.contributors = new Array();
    this.description = new Array();
    this.format = "";
    this.publisher = "";
    this.relation = "";
    this.rights = "";
    this.source = "";
    this.subject = "";
    this.type = "";
  }
}

module.exports = Metadata;
