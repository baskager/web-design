const config = require("../config/Config.singleton.class");

class MonitoringService {
  constructor() {
    this.Sentry = require("@sentry/node");
    this.initialize();
  }

  initialize() {
    this.Sentry.init({ 
      dsn: config.get("sentry.endpoint"),
      environment: config.get("environment")
    });
  }
  
  get() {
    return this.Sentry;
  }

  setLevel(level) {
    this.Sentry.configureScope(function(scope) {
      scope.setLevel(level);
    });
  }

  addUserToLoggingScope(ip, email) {
    this.Sentry.configureScope(function(scope) {
      scope.setUser({
        "email": email,
        "ip_address": ip
      });
    });
  }

  addBreadCrumb(category, message, data) {
    this.Sentry.addBreadcrumb({
      category: category,
      message: message,
      data: data,
      level: this.Sentry.Severity.Info
    });
  }

  captureException(exception) {
    this.Sentry.captureException(exception);
  }

  captureMessage(message) {
    this.Sentry.captureMessage(message);
  }
}
module.exports = new MonitoringService();