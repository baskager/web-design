const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  debug = require("debug")("kager-server"),
  exphbs = require("express-handlebars"),
  helpers = require("./lib/helpers"),
  config = require("./config"),
  port = config.port;

let handlebars = exphbs.create({
  helpers: helpers,
  defaultLayout: "main"
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// Define directory from which static files are served
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home", {
    pageName: "home",
    data: null
  });
});

app.get("/styleguide", function(req, res) {
  res.render("styleguide");
});

app.get("/projects/:categorySlug", function(req, res) {
  res.render("category-detail", {
    data: null
  });
});

app.get("/projects/:categorySlug/:projectSlug", function(req, res) {
  res.render("project-detail", {
    data: null
  });
});

http.listen(port, function() {
  console.log("Server listening on port " + port);
});
