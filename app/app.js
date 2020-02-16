const config = require("./classes/config/Config.singleton.class"),
  templateEngine = require("./classes/template/templateEngine.singleton.class"),
  express = require("express"),
  app = express(),
  routes = require('./routes'),
  Raven = require("raven"),
  http = require("http").Server(app),
  Mailer = require("./classes/mailer/Mailer.class"),
  mailer = new Mailer(config.get("mailer.smtp"));

// Set up sentry.io logging
Raven.config(
  config.get("sentry.endpoint")
).install();

app.engine("handlebars", templateEngine.getProcessor().engine);
app.set("view engine", "handlebars");
app.use("/", routes);
// Define directory from which static files are served
app.use(express.static("public"));

// TODO: Make a Logger class (Singleton)
Raven.context(function() {
  let contextData = config.get("mailer");
  delete contextData.smtp.auth;
  Raven.captureBreadcrumb({
    message: "Verifying SMTP config",
    category: "SMTP",
    data: {
      config: contextData
    }
  });
  // TODO: Create a Invariant check class
  mailer
    .verifyConnection()
    .then(success => {
      console.info("SMTP SUCCESS: configuration verified");
      console.info("Starting server for environment: " + config.get("environment"));
      const port = config.get("port") || 3000;
      http.listen(port, function() {
        console.info("\nApp listening on: http://localhost:" + port);
      });
    })
    .catch(error => {
      Raven.captureException(error);
    });
});
