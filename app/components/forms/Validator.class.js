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

    _isEmpty(value, map, returnData) {
      if (validator.isEmpty(value)) {
        returnData.inputs[map.name].errors.push(
          "Input for '" + map.name + "' was empty"
        );
        returnData.isError = true;
      }
    }

    _isEmail(value, map, returnData) {
      if (!validator.isEmail(value)) {
        returnData.inputs[map.name].errors.push(
          "'" + value + "' is not an email address"
        );
        returnData.isError = true;
      }
    }

    _isMin(value, map, returnData) {
      if (value.length < map.min) {
        returnData.inputs[map.name].errors.push(
          "Input for the field '" + map.name + "' is too short"
        );
        returnData.isError = true;
      }
    }

    _isMax(value, map, returnData) {
      if (value.length > map.max) {
        returnData.inputs[map.name].errors.push(
          "Input for the field '" + map.name + "' is too long"
        );
        returnData.isError = true;
      }
    }

    _performChecks(value, mapEntry, returnData) {
      this._isEmpty(value, mapEntry, returnData);
      // If the field was not empty, check for further errors
      if (!returnData.isError) {
        if (mapEntry.type === "email")
          this._isEmail(value, mapEntry, returnData);
        if (mapEntry.min) this._isMin(value, mapEntry, returnData);
        if (mapEntry.max) this._isMax(value, mapEntry, returnData);
      }
    }

    validateInputs(map, params) {
      let returnData = {};
      returnData.isError = false;
      returnData.inputs = {};

      for (let param in params) {
        returnData.inputs[param] = {};
        let value = validator.escape(params[param]);
        let mapEntry = map.inputs[param];

        if (mapEntry) {
          returnData.inputs[param].validated = true;
          returnData.inputs[param].errors = [];
          this._performChecks(value, mapEntry, returnData);
        } else returnData.inputs[param].validated = false;

        returnData.inputs[param].value = value;
      }
      return returnData;
    }
  } // END OF CLASS

  return Validator;
}; // END OF FUNCTION
