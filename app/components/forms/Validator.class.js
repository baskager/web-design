const validator = require("validator");
module.exports = function(config, cache) {
  const prefix = config.prefix;

  /*
     * Date: 12-08-2018
     * Author: Bas Kager
     * 
     * Maps form HTML into objects and validates data according
     * to the values defined in the form HTML.
    */
  class Validator {
    constructor() {}

    _isEmpty(value, returnData) {
      if (validator.isEmpty(value)) {
        returnData[param].errors.push("Input for '" + param + "' was empty");
        returnData[param].valid = false;
      }
    }

    _isEmail(value, returnData) {
      if (!validator.isEmail(value)) {
        returnData[param].errors.push(
          "'" + value + "' is not an email address"
        );
      }
    }

    _isMin(value, map, returnData) {
      if (value.length < map.min) {
        returnData[param].errors.push(
          "Input for the field '" + param + "' is too short"
        );
      }
    }

    _isMax(value, map, returnData) {
      if (value.length > map.max) {
        returnData[param].errors.push(
          "Input for the field '" + param + "' is too long"
        );
      }
    }

    _performChecks(value, mapEntry, returnData) {
      this._isEmpty(value, returnData);
      if (mapEntry.type === "email") this._isEmail(value, returnData);
      if (mapEntry.min) this._isMin(value, mapEntry, returnData);
      if (mapEntry.max) this._isMax(value, mapEntry, returnData);
    }

    validateInputs(map, params) {
      let returnData = {};

      for (param in params) {
        returnData[param] = {};
        let value = validator.escape(params[param]);

        let mapEntry = map.inputs[param];
        returnData[param].errors = [];

        this._performChecks(value, mapEntry, returnData);

        returnData[param].value = value;
      }
      console.dir(returnData);
    }
  } // END OF CLASS

  return Validator;
}; // END OF FUNCTION
