/**
 * Validates data using validation rules from a FormMapper object
 *
 * @since: 12-08-2018
 * @author: Bas Kager
 */
const validator = require("validator");
module.exports = function(config, cache) {
  const prefix = config.prefix;

  class Validator {
    constructor() {}
    /**
     * Checks if an input value is empty
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} value - Value of the form input
     * @param {Object} mapEntry - Entry for the input in the FormMapper object
     * @param {Object} returnData - Object containing validation info for all inputs
     *
     * @returns {boolean} Validation status for given input
     */
    _isEmpty(value, mapEntry, returnData) {
      if (validator.isEmpty(value)) {
        returnData.inputs[mapEntry.name].errors.push(
          "Input for '" + mapEntry.name + "' was empty"
        );
        returnData.isValidationError = true;
        return true;
      } else return false;
    }
    /**
     * Checks if an input value is an email address
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} value - Value of the form input
     * @param {Object} mapEntry - Entry for the input in the FormMapper object
     * @param {Object} returnData - Object containing validation info for all inputs
     *
     * @returns {boolean} Validation status for given input
     */
    _isEmail(value, mapEntry, returnData) {
      if (!validator.isEmail(value)) {
        returnData.inputs[mapEntry.name].errors.push(
          "'" + value + "' is not an email address"
        );
        returnData.isValidationError = true;
      }
    }
    /**
     * Checks if an input value is above the minimum value defined in the map entry
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} value - Value of the form input
     * @param {Object} mapEntry - Entry for the input in the FormMapper object
     * @param {Object} returnData - Object containing validation info for all inputs
     *
     * @returns {boolean} Validation status for given input
     */
    _isMin(value, mapEntry, returnData) {
      if (value.length < mapEntry.min) {
        returnData.inputs[mapEntry.name].errors.push(
          "Input for the field '" + mapEntry.name + "' is too short"
        );
        returnData.isValidationError = true;
      }
    }
    /**
     * Checks if an input value is under the maximum value defined in the map entry
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} value - Value of the form input
     * @param {Object} mapEntry - Entry for the input in the FormMapper object
     * @param {Object} returnData - Object containing validation info for all inputs
     *
     * @returns {boolean} Validation status for given input
     */
    _isMax(value, mapEntry, returnData) {
      if (value.length > mapEntry.max) {
        returnData.inputs[mapEntry.name].errors.push(
          "Input for the field '" + mapEntry.name + "' is too long"
        );
        returnData.isValidationError = true;
      }
    }

    /**
     * Checks if the form was sent by a bot
     *
     * @since: 23-06-2019
     * @author: Bas Kager
     *
     * @param {string} value - Value of the form input
     * @param {Object} mapEntry - Entry for the input in the FormMapper object
     * @param {Object} returnData - Object containing validation info for all inputs
     *
     * @returns {boolean} Validation status for given input
     */
    _isBot(value, mapEntry, returnData) {
      if (!validator.isEmpty(value)) {
        returnData.inputs[mapEntry.name].errors.push(
          "Sorry, we cannot process your inquiry at this moment"
        );
        returnData.isValidationError = true;
        return true;
      } else return false;
    }
    /**
     * Performs all checks om a form input
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} value - Value of the form input
     * @param {Object} mapEntry - Entry for the input in the FormMapper object
     * @param {Object} returnData - Object containing validation info for all inputs
     *
     * @returns {boolean} Validation status for given input
     */
    _performChecks(value, mapEntry, returnData) {
      if (mapEntry.botFilter) {
        this._isBot(value, mapEntry, returnData)
      } else {
        let isEmpty = this._isEmpty(value, mapEntry, returnData);
        // If the field was not empty, check for further errors
        if (!isEmpty) {
          if (mapEntry.type === "email")
            this._isEmail(value, mapEntry, returnData);
          if (mapEntry.min) this._isMin(value, mapEntry, returnData);
          if (mapEntry.max) this._isMax(value, mapEntry, returnData);
        }
      }
    }
    /**
     * Validate inputs using a FormMapper object (contains the validation rules for each input).
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {FormMapper} map - A map object of the form which contains the validation rules for each input
     * @param {Object} params - The inputs sent through the form
     *
     * @returns {object} Object containing validation status' for all inputs
     */
    validateInputs(map, params) {
      let returnData = {};
      returnData.isValidationError = false;
      returnData.inputs = {};

      for (let param in params) {
        returnData.inputs[param] = {};
        let value = params[param];
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
