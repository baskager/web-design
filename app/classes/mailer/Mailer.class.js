
const nodemailer = require("nodemailer");

module.exports = class Mailer {
  constructor(config) {
    this.transporter = nodemailer.createTransport(config);
  }

  verifyConnection() {
    return new Promise((resolve, reject) => {
      this.transporter.verify(function(error, success) {
        if (error) reject(error);
        else resolve(success);
      });
    });
  }

  async send(mail, recipient) {
    const transportParams = {
      to: recipient,
      from: mail.from,
      subject: mail.subject,
      html: mail.contents
    };
    return await this.transporter.sendMail(transportParams);
  }
  
};