const config = require("../config/Config.singleton.class"),
  exphbs = require("express-handlebars");
class TemplateEngine {

  constructor() {
    this.processor = exphbs.create({
      extName: config.get("templateEngine.fileExtension"),
      partialsDir: config.get("templateEngine.partialsDirectory"),
      layoutsDir: config.get("templateEngine.layoutsDirectory"),
      defaultLayout: config.get("templateEngine.defaultLayout"),
      helpers: this.getHelpers(),
    });
  }

  getHelpers() {
    return require("./helpers");
  }

  getProcessor() {
    return this.processor;
  }
  
}
module.exports = new TemplateEngine();