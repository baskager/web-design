const config = require("../../classes/config/Config.singleton.class"),
  Mail = require("../../classes/mailer/Mail.class"),
  MailTemplate = require("../../classes/mailer/MailTemplate.class"),
  Mailer = require("../../classes/mailer/Mailer.class"),
  mailer = new Mailer(config.get("mailer.smtp")),
  FormMapFactory = require("../../classes/forms/FormMapFactory.class"),
  FormMapValidator = require("../../classes/forms/FormMapValidator.class"),
  debug = require("debug")("kager-server");

module.exports = class ContactPostController {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  async post() {
    const validator = await this.getValidator();
    const validated = validator.validateRequestBody(this.request.body);

    if(validated) {
      await this.sendMail();

      if(this.isSafeToRenderTemplate()) {
        this.renderSuccess();
      }
      return;
    }

    this.renderValidationErrors(validator.getErrors());
  }

  isSafeToRenderTemplate() {
    return !this.response._headerSent;
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
    mail.setContents(mailContents);
    try {
      const mailStatus = await mailer.send(mail, config.get("mailer.contactAdress"));
      // TODO: Centralize logging and error handling with a Log class
      debug(mailStatus);
    } catch(exception) {
      // TODO: Centralize logging and error handling with a Log class
      debug(exception);
      // Raven.captureException(exception);
      this.renderContactException(exception);
      return;
    }
  }

  requestIsAJAX() {
    return this.request.headers.xhr === "true";
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

  renderValidationErrors(validationErrors) {
    if (this.requestIsAJAX()) {
      this.response.setHeader("Content-Type", "application/json");
      this.response.status(400).send(JSON.stringify(this.request.body));
    } else {
      this.response.render("contact", {
        pageName: "contact",
        requestData: this.request.body,
        validationErrors: validationErrors
      });
    }
  }

  renderContactException(exception) {
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