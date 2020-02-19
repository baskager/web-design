const config = require("../config/Config.singleton.class"),
  debug = require("debug")(config.get("debugger.name")),
  monitoringService = require("./MonitoringService.singleton.class");

module.exports = class Log {  
  static info(message) {
    console.info(message);
  }

  static debug(message) {
    debug(message);
  }

  static error(exception, message = null) {
    Log.debug(message || exception.message);
    monitoringService.captureException(exception);
  }

  // Monitor suspicious behaviour
  static suspicion(message) {
    monitoringService.setLevel("info");
    monitoringService.captureMessage(message);
  }

  static breadCrumb(category, message, data = null) {
    monitoringService.addBreadCrumb(category, message, data);
  }

  static addUserToLoggingScope(ip, email) {
    monitoringService.addUserToLoggingScope(ip, email);
  }
};