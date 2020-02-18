const config = require("../../classes/config/Config.singleton.class"),
  Mail = require("../../classes/mailer/Mail.class"),
  MailTemplate = require("../../classes/mailer/MailTemplate.class"),
  Mailer = require("../../classes/mailer/Mailer.class"),
  mailer = new Mailer(config.get("mailer.smtp")),
  FormMapFactory = require("../../classes/forms/FormMapFactory.class"),
  FormMapValidator = require("../../classes/forms/FormMapValidator.class"),
  Log = require("../../classes/log/Log.class");

module.exports = class ContactPostController {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.validationErrors = [];
  }

  async post() {
    const validator = await this.getValidator();
    const validated = validator.validateRequestBody(this.request.body);

    if(validated) {
      return this.sendMail();
    }

    this.validationErrors = validator.getErrors();
    this.logValidationFailure();
  }

  logValidationFailure() {
    Log.breadCrumb("contact", "Validation errors", this.validationErrors);
    Log.addUserToLoggingScope(this.getIPAddressFromRequest(), this.request.body.email);
    Log.suspicion("Validation did not pass on the back-end");
  }

  getIPAddressFromRequest() {
    return  this.request.headers["x-forwarded-for"] || 
            this.request.connection.remoteAddress;
  }

  async getValidator() {
    const contactFormMapFactory = new FormMapFactory(
      "views/partials/forms/contact.handlebars"
    );
    const formMap = await contactFormMapFactory.get();
    return new FormMapValidator(formMap);
  }

  async sendMail() {
    const mailTemplate = new MailTemplate("contact");
    const senderName = this.request.body.name;
    const senderEmail = this.request.body.email;

    const mail = new Mail(senderName, senderEmail, "New message from " + senderName);
    const mailContents = await mailTemplate.compile(this.request.body);
    mail.contents = mailContents;

    return mailer.send(mail, config.get("mailer.contactAdress"));
  }

  isSafeToRenderTemplate() {
    return !this.response._headerSent;
  }

  requestIsAJAX() {
    return this.request.headers.xhr === "true";
  }

  render() {
    if(this.validationErrors.length === 0) {
      this.renderSuccess();
      return;
    }
    this.renderValidationErrors();
  }

  renderSuccess() {
    if (this.requestIsAJAX()) {
      this.response.setHeader("Content-Type", "application/json");
      this.response.status(200).send(JSON.stringify(this.request.body));
    } else {
      this.response.render("contact", {
        pageName: "contact",
        requestData: this.request.body
      });
    }
  }

  renderValidationErrors() {
    if (this.requestIsAJAX()) {
      this.response.setHeader("Content-Type", "application/json");
      this.response.status(400).send(JSON.stringify(this.request.body));
    } else {
      this.response.render("contact", {
        pageName: "contact",
        requestData: this.request.body,
        validationErrors: this.validationErrors
      });
    }
  }

  renderException(exception) {
    if (this.requestIsAJAX()) {
      this.response.setHeader("Content-Type", "application/json");
      this.request.body.error = this.getErrorTemplate("mailer", exception);
      this.response.status(500).send(JSON.stringify(this.request.body));
    } else {
      this.response.render("contact", {
        pageName: "contact",
        requestData: this.request.body,
        exception: exception
      });
      this.response.end();
    }
  }

  getErrorTemplate(type, exception) {
    let template = {};
    template.type = type;
    template.info = exception;
    return template;
  }
};