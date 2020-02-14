const config = require("../../classes/config/Config.singleton.class"), 
  Mail = require("../../classes/mailer/Mail.class"),
  MailTemplate = require("../../classes/mailer/MailTemplate.class"),
  Mailer = require("../../classes/mailer/Mailer.class"),
  mailer = new Mailer(config.get("mailer.smtp")),
  FormMapFactory = require("../../classes/forms/FormMapFactory.class"),
  FormMapValidator = require("../../classes/forms/FormMapValidator.class"),
  debug = require("debug")("kager-server"),
  contactFormMapFactory = new FormMapFactory(
    "views/partials/forms/contact.handlebars"
  );

module.exports = async (request, response) => {
  // TODO: Lot's of controller logic below! Create a controller for all the endpoints :)
  const formMap = await contactFormMapFactory.get();
  const mailTemplate = new MailTemplate(formMap.name);
  const validator = new FormMapValidator(formMap);

  // Compare the request body with the validation rules on the inputs
  const validated = validator.validateRequestBody(request.body);
  // Send the email if all validations were passed

  if(validated) {
    const mail = new Mail(request.body.name, request.body.email, "New message from " + request.body.name);
    const mailContents = await mailTemplate.compile(request.body);
    mail.setContents(mailContents);

    try {
      mailStatus = await mailer.send(mail, config.get("mailer.contactAdress"));
      debug(mailStatus);
    } catch(exception) {
      debug(exception);
      // Raven.captureException(exception);
      renderContactException(request, response, exception);
      return;
    }

  }
  renderContactAfterFormSubmission(request, response, validator);
};

requestIsAJAX = (request) => {
  return request.headers.xhr === "true";
}

renderContactAfterFormSubmission = (request, response, validator) => {
  if (requestIsAJAX(request)) {
    response.setHeader("Content-Type", "application/json");
    let status = 200;
    // Set status codes on errors
    if (!validator.didValidationPass()) status = 400;

    response.status(status).send(JSON.stringify(request.body));
  } else {
    response.render("contact", {
      pageName: "contact",
      requestData: request.body,
      validationErrors: null,
      exception: exception
    });
  }
};

renderContactException = (request, response, exception) => {
  if (requestIsAJAX(request)) {
    response.setHeader("Content-Type", "application/json");
    request.body.error = getErrorTemplate("mailer", exception);

    response.status(500).send(JSON.stringify(request.body));
  } else {
    response.render("contact", {
      pageName: "contact",
      requestData: request.body,
      validationErrors: null,
      exception: exception
    });
  }
};

getErrorTemplate = (type, exception) => {
  let template = {};
  template.type = type;
  template.info = exception;
  return template;
}