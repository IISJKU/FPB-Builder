const Language = require("./classes/Languages.js");
const Page = require("./classes/Page.js");

let pages = [];

function fetchPageDataFromFrontend() {
  //data from frontend, normally saved in session storage:
  // but now im making it up!"
  let pages = [];

  let page1 = {
    name: "page1",
    text: {
      EN: "Hello this is the Content of the first page.",
      IT: "Ciao, questo è il contenuto della prima pagina.",
    },
    audio: {
      EN: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
      IT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page01.mp3",
    },
    image: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page01-fig.xhtml",
    altText: {
      EN: "This is the alt text for figure 1",
      IT: "Questo è il testo alternativo per la figura 1",
    },
  };

  let page2 = {
    name: "page2",
    text: {
      EN: "What might happen on the second page? I cant imagine...",
      IT: "Cosa potrebbe succedere nella seconda pagina? Non posso immaginare...",
    },
    audio: {
      EN: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
      IT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page02.mp3",
    },
    image: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page02-fig.xhtml",
    altText: {
      EN: "This is the alt text for figure 2",
      IT: "Questo è il testo alternativo per la figura 2",
    },
  };

  let page3 = {
    name: "page3",
    text: {
      EN: "The story comes to a surprising end, on the third page!",
      IT: "La storia giunge a una conclusione sorprendente, alla terza pagina!",
    },
    audio: {
      EN: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page03.mp3",
      IT: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\audio\\page03.mp3",
    },
    image: "C:\\Users\\ak127746\\Desktop\\EPUB file exploration\\OEBPS\\xhtml\\page03-fig.xhtml",
    altText: {
      EN: "This is the alt text for figure 3",
      IT: "Questo è il testo alternativo per la figura 3",
    },
  };

  pages.push(page1);
  pages.push(page2);
  pages.push(page3);
}

function getPages() {
  return pages;
}

module.exports.getPages = getPages;
module.exports.fetchPageDataFromFrontend = fetchPageDataFromFrontend;
