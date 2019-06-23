/**
 * Maps an HTML form (which contains validation attributes) into an object
 * to enable server-side validation on the form
 *
 * @since: 12-08-2018
 * @author: Bas Kager
 */
const fs = require("fs"),
  jsdom = require("jsdom"),
  { JSDOM } = jsdom,
  util = require("util");

module.exports = function(config, cache) {
  const prefix = config.prefix;
  class FormMapper {
    /**
     * Constructor, initialises the object with a template file
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} templateFileName Template file of the form to be mapped
     *
     * @returns {void}
     */
    constructor(templateFileName) {
      this.templateFile = templateFileName;
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
    get() {
      return new Promise((resolve, reject) => {
        let cachedMap = cache.get("FormMapper", this.templateFile);
        // If map is cached, resolve with the cached map
        if (cachedMap) resolve(cachedMap);
        else {
          // Build map and save to cache if cacheing is enabled on the form
          this._buildMap(this.templateFile)
            .then(map => {
              if (map.isCache) {
                cache.add(this.constructor.name, this.templateFile, map);
                cache.saveToFile();
              }
              resolve(map);
            })
            .catch(err => {
              reject(err);
            });
        }
      });
    }
    /**
     * Builds complete object to make form compatible with
     * validation functions. Can also be cached to validate
     * straight out of memory.
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} templateFile - Name of the template file to be mapped
     *
     * @returns {Object} Validation map object
     */
    _buildMap(templateFile) {
      return new Promise((resolve, reject) => {
        fs.readFile(templateFile, "utf8", (error, html) => {
          if (error) reject(error);

          const dom = new JSDOM(html);

          const formElement = dom.window.document.querySelector("form");
          const inputs = formElement.querySelectorAll(
            "[" + prefix + "map='true']"
          );
          // Map the form metadata
          let map = {
            name: formElement.getAttribute(prefix + "name"),
            version: formElement.getAttribute(prefix + "version"),
            // Converts the string to a boolean
            isCache: formElement.getAttribute(prefix + "cache") === "true",
            inputs: {}
          };
          // Map the input metadata
          map.inputs = this._mapInputs(inputs);

          resolve(map);
        });
      });
    }

    /**
     * Maps inputs for a form to prepare them for validation
     * on future requests
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {Object} inputs - HTMLInputElements from a form
     *
     * @returns {Object} Object containing validation info of inputs
     */
    _mapInputs(inputs) {
      let returnData = {};
      for (let input of inputs) {
        let inputName = input.name;
        let type = input.type;
        let min = input.minLength;
        let max = input.maxLength;
        let placeholder = input.getAttribute("placeholder");
        let botFilter = input.getAttribute(prefix + "filter") === "true";

        // Example: A textarea does not have a type attribute.
        // We need another way to identify what kind of input it is
        if (type === null) {
          type = input.tagName.toLowerCase();
        }

        returnData[inputName] = {
          name: inputName,
          type: type,
          min: min,
          max: max,
          placeholder: placeholder,
          botFilter: botFilter
        };
      }
      return returnData;
    }
  } // END OF CLASS

  return FormMapper;
}; // END OF FUNCTION
