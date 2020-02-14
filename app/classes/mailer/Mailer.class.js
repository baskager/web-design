
const config = require("../config/Config.singleton.class"),
nodemailer = require("nodemailer");
/**
 * A wrapper class for nodemailer that sends emails using
 * handlebars templates and promises
 *
 * @since: 14-08-2018
 * @author: Bas Kager
 */
module.exports = class Mailer {
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
    constructor(config) {
      this.transporter = nodemailer.createTransport(config);
    }
    /**
     * Verify if the smtp configuration is correct
     *
     * @since: 14-08-2018
     * @author: Bas Kager
     *
     * @returns {Object} Object containing the status of the verification
     */
    verify() {
      return new Promise((resolve, reject) => {
        if (config.get("environment") === "development") {
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
     * @returns {Object} Object comail
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
    async send(mail, recipient) {
      const transportParams = {
        to: recipient,
        from: mail.from,
        subject: mail.subject,
        html: mail.contents
      };

      return await this.transporter.sendMail(transportParams);
    }

  } // END OF CLASS