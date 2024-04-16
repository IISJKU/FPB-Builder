const Page = require("./classes/Page.js");

let pages = [];

function fetchPageDataFromFrontend() {
  //data from frontend, normally saved in session storage:
  // but now im making it up!"

  pages = [];

  let page1 = {
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
  };

  let page2 = {
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
  };

  let page3 = {
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
