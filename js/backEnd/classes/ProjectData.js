const Metadata = require("./Metadata.js");
const Page = require("./Page.js");

class ProjectData {
  name = "";
  directory = "";
  metadata = [];
  languages = [];
  pages = [];
  settings = [];
  fonts = [];
  numberOfLayers = 5;

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
    await window.webContents.executeJavaScript('document.getElementById("projName").value', true).then(async (result) => {
      //this.name = (result != null ? result : "Test" + Math.floor(Math.random() * 100));
      this.name = result;
      await this.getDirectory(window);
    });
  }

  async getDirectory(window){
    await window.webContents.executeJavaScript('document.getElementById("directory").value', true).then(async (result) => {
      this.directory = result;
      await this.getSettings(window);
    });
  }

  async getSettings(window){
    await window.webContents.executeJavaScript('getOthSettings()', true).then(async (result) => {
      this.settings = result;
      await this.getNumberOfLayers(window);
    });
  }

  async getNumberOfLayers(window) {
    await window.webContents.executeJavaScript('document.getElementById("layers").valueAsNumber', true).then(async (result) => {
      this.numberOfLayers = result;
      await this.getFonts(window);
    });
  }

  async getFonts(window){
    await window.webContents.executeJavaScript('getSelectedFonts()', true).then(async (result) => {
      this.fonts = result;
      await this.getPages(window);
    });
  }

  async getPages(window){
    await window.webContents.executeJavaScript('JSON.parse(sessionStorage.getItem("pageDetails"))', true).then(async (result) => {
      this.pages = result;
      await this.fillProperties();
    });
  }

  fillProperties() {
    this.name;
    this.directory;
    this.languages;
    this.numberOfLayers;
    this.settings;
    this.metadata;
    this.pages;
    this.fonts;
  }
}

module.exports = ProjectData;
