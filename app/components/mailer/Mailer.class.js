nodemailer = require("nodemailer");
module.exports = function(config, cache) {
  class Cache {
    constructor(handlebars) {
      this.transporter = nodemailer.createTransport(config.smtp);
      this.handlebars = handlebars;
    }

    verify() {
      return new Promise((resolve, reject) => {
        // verify connection configuration
        this.transporter.verify(function(error, success) {
          if (error) reject(error);
          else resolve(success);
        });
      });
    }

    send(mailconfig) {
      return new Promise((resolve, reject) => {
        let mailoptions = mailconfig.mailoptions;

        this._compileTemplate(mailconfig.template, mailconfig.data).then(
          html => {
            mailoptions.html = html;

            this.transporter.sendMail(mailoptions, function(error, info) {
              console.dir(error);
              console.dir(info);
              if (error) reject(error);
              else resolve(mailconfig.data);
            });
          }
        );
      });
    }

    _compileTemplate(templateName, data) {
      return new Promise((resolve, reject) => {
        let filePath = "views/mailer/" + templateName + ".handlebars";

        this.handlebars
          .render(filePath, { data: data })
          .then(html => {
            resolve(html);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  } // END OF CLASS

  return Cache;
}; // END OF FUNCTION
