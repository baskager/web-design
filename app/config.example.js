module.exports = {
  port: 1995,
  environment: "development",
  mailer: {
    contactAdress: "ENTER_YOUR_OWN_EMAIL",
    smtp: {
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      service: "sendgrid",
      auth: {
        user: "apikey",
        pass: "ENTER_YOUR_PASSWORD_OR_API_KEY"
      }
    }
  },
  formMapper: {
    prefix: "v-"
  },
  cache: {
    location: "storage/cache/",
    defaultFile: "default.json",
    save: true
  },
  sentry: {
    endpoint: "YOUR_SENTRY_DSN"
  },
  debugger: {
    name: "kager-server"
  },
  templateEngine: {
    fileExtension: ".handlebars",
    partialsDirectory: "views/partials/",
    layoutsDirectory: "views/layouts",
    defaultLayout: "main"
  },
};
