/**
 * A wrapper class for nodemailer that sends emails using
 * handlebars templates and promises
 *
 * @since: 14-08-2018
 * @author: Bas Kager
 */
nodemailer = require("nodemailer");
module.exports = function(config, cache, environment) {
  class Mailer {
    /**
     * Constructor, initialises the mailer with a handlebars object
     *
     * @since: 14-08-2018
     * @author: Bas Kager
     *
     * @param {Object} handlebars Handlebars template engine object
     *
     * @returns {void}
     */
    constructor(handlebars) {
      this.transporter = nodemailer.createTransport(config.smtp);
      this.handlebars = handlebars;
    }
    /**
     * Veryify if the smtp configuration is correct
     *
     * @since: 14-08-2018
     * @author: Bas Kager
     *
     * @returns {Object} Object containing the status of the verification
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
    /**
     * Sends an email with a handelbars template and supplied data.
     * Accepts a JSON object as parameter.
     * 
     * Templates are stored in /views/mailer/[template_name].handlebars
     *
     * @since: 14-08-2018
     * @author: Bas Kager
     *
     * @returns {Object} Object containing the status of the email
     * 
     * @example Mailer.send({
          mailoptions: {
            to: "johndoe@example.com",
            from: "alicedoe@example.com",
            subject: "New message from Alice"
          },
          template: {
            name: "template_name",
            context: { validatedData }
          }
        });
     */
    send(mailconfig) {
      return new Promise((resolve, reject) => {
        let mailoptions = mailconfig.mailoptions;

        this.compileHTMLtemplate(
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
    compileHTMLtemplate(templateName, context) {
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
