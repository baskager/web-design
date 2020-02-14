
const templateEngine = require("../../classes/template/templateEngine.singleton.class");

module.exports = class MailTemplate {
  constructor(templateFileName) {
    this.templateFilePath = "views/mailer/" + templateFileName + ".handlebars";
  }
  /**
   * Compiles a handlebars template with the specified context data to raw HTML
   *
   * @since: 14-08-2018
   * @author: Bas Kager
   *
   * @param {string} templatename - Path of the template to be compiled
   * @param {Object} context - Context data to be injected into the template
   *
   * @returns {string} The compiled template in raw html
   */
  async compile(context) {
    return await templateEngine.getProcessor().render(this.templateFilePath, context);
  }


}