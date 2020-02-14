const fs = require("fs"),
jsdom = require("jsdom"),
{ JSDOM } = jsdom,
FormMap = require("./FormMap.class"),
FormMapInput = require("./FormMapInput.class"),
config = require("../config/Config.singleton.class"),
cache = require("../cache/Cache.class");
/**
 * Maps an HTML form (which contains validation attributes) into an object
 * to enable server-side validation on the form
 *
 * @since: 12-08-2018
 * @author: Bas Kager
 */

module.exports = class FormMapFactory {
    constructor(templateFileName) {
      this.templateFileName = templateFileName;
    }
    /**
     * Get the validation map for the form.
     *
     * - Return map if it's already available.
     * - Build map if it's not already available.
     * - Cache map if isCache is 'true' in the HTML form.
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @returns {Object} Validation map object
     */
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

    /**
     * Builds complete object to make form compatible with
     * validation functions. Can also be cached to validate
     * straight out of memory.
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} templateFileName - Name of the template file to be mapped
     *
     * @returns {Object} Validation map object
     */
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
      return new Promise((resolve, reject) => {
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

    /**
     * Maps inputs for a form to prepare them for validation
     * on future requests
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {Object} DOMInputNodes - HTMLInputElements from a form
     *
     * @returns {Object} Object containing validation info of inputs
     */
    setMapInputs(map, DOMInputNodes) {
      for (let DOMInput of DOMInputNodes) {
        const mapInput = new FormMapInput();
        const botfilterAttribute = this.getMapAttributeFromDOMNode(DOMInput, "filter");

        mapInput.setName(DOMInput.name);
        mapInput.setMinLength(DOMInput.minLength)
        mapInput.setMaxLength(DOMInput.maxLength);
        mapInput.setPlaceholder(DOMInput.getAttribute("placeholder"));
        mapInput.setIsBotfilter(botfilterAttribute);
        mapInput.setType(DOMInput.type);

        map.addInput(mapInput);
      }
    }

    getFormElementFromDOM(dom) {
      return dom.window.document.querySelector("form");
    }

    buildAttributeSelectorString(attributeKey, value = null) {
      let selector =  config.get("formMapper.prefix") + attributeKey;

      if(value) {
        selector = "[" + selector + "=" + value + "]";
      }

      return selector;
    }

    getMapAttributeFromDOMNode(DOMNode, key, value = null) {
      const selector = this.buildAttributeSelectorString(key, value);
      return DOMNode.getAttribute(selector)
    }

    getMappableInputElementsFromForm(formElement) {
      const selector = this.buildAttributeSelectorString("map", "true");
      return formElement.querySelectorAll(selector);
    }

    getDOMElementTypeByTagname(DOMElement) {
      return DOMElement.tagName.toLowerCase()
    }

  } // END OF CLASS