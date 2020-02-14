module.exports = class FormMapInput {
  constructor() {
    this.name = undefined;
    this.type = undefined;
    this.minLength = undefined;
    this.maxLength = undefined;
    this.placeholder = undefined;
    this.isBotfilter = undefined;
    this.type = undefined;
  }

  setName(name) {
    this.name = name;
  }

  setType(type) {
    this.type = type;
  }

  setMinLength(minLength) {
    this.minLength = minLength;
  }

  setMaxLength(maxLength) {
    this.maxLength = maxLength;
  }

  setPlaceholder(placeholder) {
    this.placeholder = placeholder;
  }

  setIsBotfilter(isBotfilter) {
    this.isBotfilter = isBotfilter === "true";
  }

  setType(type) {
    this.type = type;
  }

}
module.exports.FormMapInput;