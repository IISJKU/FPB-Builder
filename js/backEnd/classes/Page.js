class Page {
  constructor() {
    this.Image = Image;
    this.Text = Text;
  }
}

class Image {
  constructor(src, altText) {
    this.src = src;
    this.altText = altText;
  }
}

class Text {
  constructor(title, lang, text, audio) {
    this.title = title;
    this.lang = lang;
    this.text = text;
    this.audio = audio;
  }
}

module.exports.Text = Text;
module.exports.Image = Image;
module.exports = Page;
