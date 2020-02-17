const routes = require("express").Router();

routes.get("/", require("./home"));
routes.use("/portfolio", require("./portfolio"));
routes.use("/project/", require("./project"));
routes.use("/contact/", require("./contact"));

module.exports = routes;