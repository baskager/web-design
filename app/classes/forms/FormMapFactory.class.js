const fs = require("fs"),
  jsdom = require("jsdom"),
  { JSDOM } = jsdom,
  FormMap = require("./FormMap.class"),
  FormMapInput = require("./FormMapInput.class"),
  config = require("../config/Config.singleton.class"),
  cache = require("../cache/Cache.singleton.class");

/**
 * Creates a map of validation rules from a form template file
 */
module.exports = class FormMapFactory {
  constructor(templateFileName) {
    this.templateFileName = templateFileName;
  }

  async get() {
    if (this.isCached()) {
      return this.getCached();
    }
    return await this.createNewFromTemplate(this.templateFileName);
  }

  isCached() {
    return cache.exists("FormMap", this.templateFileName);
  }

  getCached() {
    return cache.get("FormMap", this.templateFileName);
  }

  async createNewFromTemplate(fileName) {
    const dom = await this.readFormTemplateDOM(fileName);
    const mapFromTemplate = await this.buildFormMap(dom);

    if (mapFromTemplate.enableCache) {
      // It is safe to run this synchronously as the cache will not be used right away.
      this.setCache(mapFromTemplate);
    }

    return mapFromTemplate;
  }

  setCache(map) {
    cache.add("FormMap", this.templateFileName, map);
    cache.saveToFile();
  }

  readFormTemplateDOM(templateFileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(templateFileName, "utf8", (error, html) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(new JSDOM(html));
      });
    });
  }

  buildFormMap(dom) {
    return new Promise((resolve) => {
      const formElement = this.getFormElementFromDOM(dom);
      const inputs = this.getMappableInputElementsFromForm(formElement);

      const name = this.getMapAttributeFromDOMNode(formElement, "name");
      const version = this.getMapAttributeFromDOMNode(formElement, "version");
      const enableCache = this.getMapAttributeFromDOMNode(formElement, "cache") === "true";
        
      const map = new FormMap(name, version, enableCache);
      this.setMapInputs(map, inputs);

      resolve(map);
    });
  }

  setMapInputs(map, DOMInputNodes) {
    for (let DOMInput of DOMInputNodes) {
      const mapInput = new FormMapInput();
      const botfilterAttribute = this.getMapAttributeFromDOMNode(DOMInput, "filter");

      mapInput.name = DOMInput.name;
      mapInput.minLength = DOMInput.minLength;
      mapInput.maxLength = DOMInput.maxLength;
      mapInput.placeholder = DOMInput.getAttribute("placeholder");
      mapInput.botfilterAttribute = botfilterAttribute;
      mapInput.type = DOMInput.type;

      map.addInput(mapInput);
    }
  }

  getFormElementFromDOM(dom) {
    return dom.window.document.querySelector("form");
  }

  getMapAttributeFromDOMNode(DOMNode, key, value = null) {
    const selector = this.buildAttributeSelectorString(key, value);
    return DOMNode.getAttribute(selector);
  }

  getMappableInputElementsFromForm(formElement) {
    const selector = this.buildAttributeSelectorString("map", "true");
    return formElement.querySelectorAll(selector);
  }

  buildAttributeSelectorString(attributeKey, value = null) {
    let selector =  config.get("formMapper.prefix") + attributeKey;

    if(value) {
      selector = "[" + selector + "=" + value + "]";
    }

    return selector;
  }

  getDOMElementTypeByTagname(DOMElement) {
    return DOMElement.tagName.toLowerCase();
  }
};