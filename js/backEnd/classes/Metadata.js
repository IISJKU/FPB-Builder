class Metadata {
  //required Metadata
  title = "";
  language = "";
  identifier = "";

  //optional
  creators = [];
  contributors = [];
  description = "";
  format = "";
  publisher = "";
  relation = "";
  rights = "";
  source = "";
  subject = "";
  type = "";

  constructor(title, language, identifier) {
    this.title = title;
    this.language = language;
    this.identifier = identifier;
  }
}

module.exports = Metadata;
