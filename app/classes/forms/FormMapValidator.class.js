const ERROR_TYPES = require("./VALIDATOR_ERROR_TYPES.enum");
const ERROR_MESSAGES = require("./VALIDATOR_ERROR_MESSAGES.enum");
const validator = require("validator");
/**
 * Validates data using validation rules from a FormMapper object
 *
 * @since: 12-08-2018
 * @author: Bas Kager
 */
module.exports = class FormMapValidator {
    constructor(formMap) {
      this.formMap = formMap;
      this.errors = [];
    }

    didValidationPass() {
      return this.errors.length === 0;
    }

    resetErrors() {
      this.errors = [];
    }

    /**
     * Validate inputs using a FormMapper object (contains the validation rules for each input).
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {FormMapper} map - A map object of the form which contains the validation rules for each input
     * @param {Object} requestBody - The inputs sent through the form
     *
     * @returns {object} Object containing validation status' for all inputs
     */
    validateRequestBody(requestBody) {
      this.resetErrors();
      this.validateAllEntries(requestBody);
      return this.didValidationPass();
    }

    validateAllEntries(entries) {
      for (let input in entries) {
        let value = entries[input];
        let formMapEntry = this.getMapEntryByName(this.formMap, input);

        this.performChecks(value, formMapEntry);
      }
    }

    getMapEntryByName(map, name) {
      return map.inputs.find(input => {
        return input.name === name;
      });
    }

    /**
     * Performs all checks om a form input
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} value - Value of the form input
     * @param {Object} formMapInput - Entry for the input in the FormMapper object
     * @param {Object} returnData - Object containing validation info for all inputs
     *
     * @returns {boolean} Validation status for given input
     */
    performChecks(value, formMapInput) {
      if (this.isBotFilterTriggered(formMapInput, value)) {
        this.logError(ERROR_TYPES.BOTFILTER_TRIGGERED, formMapInput, value);
        return;
      }

      if (this.isValueEmpty(formMapInput, value)) {
        this.logError(ERROR_TYPES.EMPTY, formMapInput, value);
        return;
      }

      if (this.isValueInvalidEmail(formMapInput, value)) {
        this.logError(ERROR_TYPES.EMAIL_INVALID, formMapInput, value);
      }
      
      if (this.isValueMinLengthInvalid(formMapInput, value)) {
        this.logError(ERROR_TYPES.MIN_LENGTH_INVALID, formMapInput, value);
      }

      if (this.isValueMaxLengthInvalid(formMapInput, value)) {
        this.logError(ERROR_TYPES.MAX_LENGTH_INVALID, formMapInput, value);
      }
    }

    logError(ERROR_TYPE, mapEntry, value) {
      const errorMessage = this.buildErrorMessage(ERROR_TYPE, mapEntry, value);
      this.errors.push({
        type: ERROR_TYPE,
        message: errorMessage
      });
    }

    buildErrorMessage(ERROR_TYPE, mapEntry, value = null) {
      let messageTemplate = ERROR_MESSAGES[ERROR_TYPE];

      let errorMessage = this.setErrorMessageTemplateString(messageTemplate, "input_name", mapEntry.name);
      if(value) {
        errorMessage = this.setErrorMessageTemplateString(messageTemplate, "input_value", value);
      }

      return errorMessage;
    }

    setErrorMessageTemplateString(message, key, value) {
      const keyString = "{" + key + "}";
      return message.replace(keyString, value);
    }

    isBotFilterTriggered(formMapInput, value) {
      return formMapInput.isBotfilter && !validator.isEmpty(value);
    }

    isValueInvalidEmail(formMapInput, value) {
      return formMapInput.type === "email" && !validator.isEmail(value);
    }

    isValueMinLengthInvalid(formMapInput, value) {
      return formMapInput.minLength && value < formMapInput.minLength;
    }

    isValueMaxLengthInvalid(formMapInput, value) {
      return formMapInput.maxLength && value > formMapInput.maxLength;
    }

    isValueEmpty(formMapInput, value) {
      return !formMapInput.isBotfilter && validator.isEmpty(value);
    }

  } // END OF CLASS