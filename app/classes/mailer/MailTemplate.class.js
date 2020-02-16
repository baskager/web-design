
const templateEngine = require("../../classes/template/templateEngine.singleton.class");

module.exports = class MailTemplate {
  constructor(templateFileName) {
    this.templateFilePath = "views/mailer/" + templateFileName + ".handlebars";
  }

  async compile(context) {
    return await templateEngine.getProcessor().render(this.templateFilePath, context);
  }

}