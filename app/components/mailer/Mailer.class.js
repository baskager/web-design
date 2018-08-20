nodemailer = require("nodemailer");
module.exports = function(config, cache, environment) {
  /*
     * Date: 14-08-2018
     * Author: Bas Kager
     * 
     * A wrapper class for nodemailer that sends emails using
     * handlebars templates and promises
    */
  class Mailer {
    constructor(handlebars) {
      this.transporter = nodemailer.createTransport(config.smtp);
      this.handlebars = handlebars;
    }
    /*
     * Date: 14-08-2018
     * Author: Bas Kager
     * 
     * Veryify if the smtp configuration is correct
    */
    verify() {
      return new Promise((resolve, reject) => {
        if (environment === "development") {
          console.log("On development environment, skipping SMTP check");
          resolve(true);
        }
        // verify connection configuration
        this.transporter.verify(function(error, success) {
          if (error) reject(error);
          else resolve(success);
        });
      });
    }
    /*
     * Date: 14-08-2018
     * Author: Bas Kager
     * 
     * Sends an email with a handelbars template and supplied data.
     * Accepts a JSON object as parameter.
     * 
     * Templates are stored in /views/mailer/[template_name].handlebars
       {
          mailoptions: {
            to: "johndoe@example.com",
            from: "alicedoe@example.com",
            subject: "New message from Alice"
          },
          template: {
            name: "template_name",
            context: { validatedData }
          }
        }
    */
    send(mailconfig) {
      return new Promise((resolve, reject) => {
        let mailoptions = mailconfig.mailoptions;

        this._compileTemplate(
          mailconfig.template.name,
          mailconfig.template.context
        )
          .then(html => {
            mailoptions.html = html;

            this.transporter.sendMail(mailoptions, function(error, info) {
              if (error) reject(error);
              else resolve(info);
            });
          })
          .catch(error => {
            reject(error);
          });
      });
    }
    /*
     * Date: 14-08-2018
     * Author: Bas Kager
     * 
     * Compiles a handlebars template with the specified context data to raw HTML
    */
    _compileTemplate(templateName, context) {
      return new Promise((resolve, reject) => {
        let filePath = "views/mailer/" + templateName + ".handlebars";

        console.dir(context);
        this.handlebars
          .render(filePath, context)
          .then(html => {
            resolve(html);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  } // END OF CLASS

  return Mailer;
}; // END OF FUNCTION
