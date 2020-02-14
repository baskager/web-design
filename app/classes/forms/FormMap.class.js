module.exports = class FormMap {
  constructor(name, version, enableCache) {
    this.name = name;
    this.version = version;
    this.enableCache = enableCache;
    this.inputs = [];
  }

  addInput(input) {
    this.inputs.push(input);
  }

}