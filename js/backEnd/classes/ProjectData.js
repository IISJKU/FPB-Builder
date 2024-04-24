const Metadata = require("./Metadata.js");
const Page = require("./Page.js");

class ProjectData {
  name = "";
  directory = "";
  metadata = [];
  languages = [];
  pages = [];
  importedFiles = [];

  async fillData(window, dir){
    await window.webContents.executeJavaScript('JSON.parse(sessionStorage.getItem("bookDetails"))', true).then(async (result) => {
      this.metadata = result;
      await this.getLanguages(window, dir);
    });
  }

  async getLanguages(window, dir){
    await window.webContents.executeJavaScript('JSON.parse(sessionStorage.getItem("pubLang"))', true).then(async (result) => {
      this.languages = result;
      await this.getProjectName(window, dir);
    });
  }

  async getProjectName(window, dir){
    await window.webContents.executeJavaScript('sessionStorage.getItem("projectName")', true).then((result) => {
      this.name = (result != null ? result : "Test" + Math.floor(Math.random() * 100));
      this.fillProperties(dir);
      //await this.getPages(window, dir);
    });
  }

  async getPages(window, dir){
    await window.webContents.executeJavaScript('JSON.parse(sessionStorage.getItem("pageDetails"))', true).then((result) => {
      this.pages = result;
      this.fillProperties(dir);
    });
  }

  fillProperties(dir) {
    this.name;
    this.languages;
    this.directory = dir;
    this.pages = [
      {
        title: "page1",
        text: {
          EN: "Hello this is the Content of the first page.",
          IT: "Ciao, questo è il contenuto della prima pagina.",
          DE: "Hallo, das ist der Inhalt der ersten Seite.",
          FR: "Bonjour, voici le contenu de la première page.",
          LIT: "Sveiki, tai yra pirmojo puslapio turinys.",
        },
        audio: {
          EN: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
          IT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
          DE: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
          FR: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
          LIT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
        },
        image: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page01-fig.xhtml",
        altText: {
          EN: "This is the alt text for figure 1",
          IT: "Questo è il testo alternativo per la figura 1",
          DE: "Dies ist der Alternativtext für Abbildung 1",
          FR: "Ceci est le texte alternatif de la figure 1",
          LIT: "Tai yra 1 paveikslo alternatyvus tekstas",
        },
      },
      {
        title: "page2",
        text: {
          EN: "What might happen on the second page? I cant imagine...",
          IT: "Cosa potrebbe succedere nella seconda pagina? Non posso immaginare...",
          DE: "Was könnte auf der zweiten Seite passieren? Ich kann es mir nicht vorstellen...",
          FR: "Que pourrait-il se passer sur la deuxième page ? Je ne peux pas imaginer...",
          LIT: "Kas gali nutikti antrame puslapyje? Neįsivaizduoju...",
        },
        audio: {
          EN: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
          IT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
          DE: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
          FR: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
          LIT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
        },
        image: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page02-fig.xhtml",
        altText: {
          EN: "This is the alt text for figure 2",
          IT: "Questo è il testo alternativo per la figura 2",
          DE: "Dies ist der Alternativtext für Abbildung 2",
          FR: "Ceci est le texte alternatif de la figure 2",
          LIT: "Tai yra 2 paveikslo alternatyvus tekstas",
        },
      },
      {
        title: "page3",
        text: {
          EN: "The story comes to a surprising end, on the third page!",
          IT: "La storia giunge a una conclusione sorprendente, alla terza pagina!",
          DE: "Auf der dritten Seite findet die Geschichte ein überraschendes Ende!",
          FR: "L'histoire se termine de manière surprenante, à la troisième page !",
          LIT: "Trečiame puslapyje istorija netikėtai baigiasi!",
        },
        audio: {
          EN: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page03.mp3",
          IT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page03.mp3",
          DE: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page03.mp3",
          FR: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page03.mp3",
          LIT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page03.mp3",
        },
        image: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page03-fig.xhtml",
        altText: {
          EN: "This is the alt text for figure 3",
          IT: "Questo è il testo alternativo per la figura 3",
          DE: "Dies ist der Alternativtext für Abbildung 3",
          FR: "Ceci est le texte alternatif de la figure 3",
          LIT: "Tai yra 3 paveikslo alternatyvus tekstas",
        },
      },
    ];
    this.importedFiles = [
      "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
      "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page01-fig.xhtml",
      "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page02-fig.xhtml",
      "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page03-fig.xhtml",
      "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page04-fig.xhtml",
      "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page05-fig.xhtml",
      "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page06-fig.xhtml",
    ];
    this.metadata;
  }
}

module.exports = ProjectData;
