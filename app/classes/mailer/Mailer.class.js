
const nodemailer = require("nodemailer"),
  Log = require("../log/Log.class"),
  cloneDeep = require("clone-deep");

module.exports = class Mailer {
  constructor(config) {
    this.config = config;
    this.transporter = nodemailer.createTransport(config);
  }

  async send(mail, recipient) {
    const transportParams = {
      to: recipient,
      from: mail.from,
      subject: mail.subject,
      html: mail.contents
    };
    const mailStatus = await this.transporter.sendMail(transportParams);
    return mailStatus;
  }
  
  // This is important so that we don't log sensitive information :)
  getLoggableContextData() {
    let contextData = cloneDeep(this.config);
    delete contextData.auth;
    return contextData;
  }

  async verifyConnection() {
    const contextData = this.getLoggableContextData();
    Log.breadCrumb("SMTP", "Verifying SMTP config", contextData);

    return this.transporter.verify();
  }
};