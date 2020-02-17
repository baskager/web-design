const ERROR_TYPES = require("./VALIDATOR_ERROR_TYPES.enum");
const ERROR_MESSAGES = require("./VALIDATOR_ERROR_MESSAGES.enum");
const validator = require("validator");

module.exports = class FormMapValidator {
  constructor(formMap) {
    this.formMap = formMap;
    this.errors = [];
  }

  didValidationPass() {
    return this.errors.length === 0;
  }

  getErrors() {
    return this.errors;
  }

  validateRequestBody(requestBody) {
    this.resetErrors();
    this.validateAllEntries(requestBody);
    return this.didValidationPass();
  }

  resetErrors() {
    this.errors = [];
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
};