const Metadata = require("./Metadata.js");
const Page = require("./Page.js");

class ProjectData {
  name = "";
  directory = "";
  metadata = [];
  languages = [];
  pages = [];
  importedFiles = [];

  async fillData(window){
    await window.webContents.executeJavaScript('JSON.parse(sessionStorage.getItem("bookDetails"))', true).then(async (result) => {
      this.metadata = result;
      await this.getLanguages(window);
    });
  }

  async getLanguages(window){
    await window.webContents.executeJavaScript('JSON.parse(sessionStorage.getItem("pubLang"))', true).then(async (result) => {
      this.languages = result;
      await this.getProjectName(window);
    });
  }

  async getProjectName(window){
    await window.webContents.executeJavaScript('sessionStorage.getItem("projectName")', true).then(async (result) => {
      this.name = (result != null ? result : "Test" + Math.floor(Math.random() * 100));
      await this.getDirectory(window);
    });
  }

  async getDirectory(window){
    await window.webContents.executeJavaScript('document.getElementById("directory").value', true).then(async (result) => {
      this.directory = result;
      await this.getPages(window);
    });
  }

  async getPages(window){
    await window.webContents.executeJavaScript('JSON.parse(sessionStorage.getItem("pageDetails"))', true).then((result) => {
      this.pages = result;
      this.fillProperties();
    });
  }

  fillProperties() {
    this.name;
    this.languages;
    this.directory;
    this.pages;
    this.metadata;
  }
}

module.exports = ProjectData;
