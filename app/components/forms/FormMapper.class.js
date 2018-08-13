const fs = require("fs"),
  jsdom = require("jsdom"),
  { JSDOM } = jsdom,
  util = require("util");

module.exports = function(config, cache) {
  const prefix = config.prefix;

  /*
     * Date: 12-08-2018
     * Author: Bas Kager
     * 
     * Maps an HTML form with custom validation attributes into an object
     * to enable server-side validation on the form 
     * 
    */
  class FormMapper {
    /*
     * Date: 12-08-2018
     * Author: Bas Kager
     * 
     * Checks if the form was mapped and cached before.
     * - If so, return the cached map
     * - If not, call the getMap() function
    */
    constructor(templateFile) {
      this.templateFile = templateFile;
    }
    /*
     * Date: 12-08-2018
     * Author: Bas Kager
     * 
     * - Return map if it's already available.
     * - Build map if it's not already available.
     * - Cache map if isCache is 'true' in the HTML form.
    */
    get() {
      return new Promise((resolve, reject) => {
        let cachedMap = cache.get("FormMapper", this.templateFile);
        if (cachedMap) resolve(cachedMap);
        else {
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
    /*
     * Date: 12-08-2018
     * Author: Bas Kager
     * 
     * Builds complete object to make form compatible with
     * validation functions. Can also be cached to validate
     * straight out of memory.
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

    /*
     * Date: 12-08-2018
     * Author: Bas Kager
     * 
     * Maps inputs for a form to prepare them for validation
     * on future requests
    */
    _mapInputs(inputs) {
      let returnData = {};
      for (let input of inputs) {
        let inputName = input.getAttribute("name");
        let type = input.getAttribute("type");
        let min = input.getAttribute(prefix + "min");
        let max = input.getAttribute(prefix + "max");
        let placeholder = input.getAttribute("placeholder");

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
          placeholder: placeholder
        };
      }
      return returnData;
    }
  } // END OF CLASS

  return FormMapper;
}; // END OF FUNCTION
