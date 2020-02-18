const DEFAULT_PORT = 3000;

const config = require("./classes/config/Config.singleton.class"),
  templateEngine = require("./classes/template/templateEngine.singleton.class"),
  express = require("express"),
  app = express(),
  routes = require("./routes"),
  http = require("http").Server(app),
  Mailer = require("./classes/mailer/Mailer.class"),
  mailer = new Mailer(config.get("mailer.smtp")),
  Log = require("./classes/log/Log.class"),
  monitoringService = require("./classes/log/MonitoringService.singleton.class"),
  monitoringMiddleware = monitoringService.get(),
  port = config.get("port") || DEFAULT_PORT;

app.engine("handlebars", templateEngine.getProcessor().engine);
app.set("view engine", "handlebars");

app.use(monitoringMiddleware.Handlers.requestHandler());
app.use(monitoringMiddleware.Handlers.errorHandler());

app.use(express.static("public"));
app.use("/", routes);

mailer.verifyConnection().then(() => {
  Log.info("SMTP SUCCESS: configuration verified");

  Log.info("Starting server for environment: " + config.get("environment"));
  http.listen(port, function() {
    Log.info("\nApp listening on: http://localhost:" + port);
  });
}).catch(exception => {
  Log.error(exception, "Could not verify mail config");
});