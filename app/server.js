const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  debug = require("debug")("kager-server"),
  exphbs = require("express-handlebars"),
  helpers = require("./lib/helpers"),
  fs = require("fs");
(config = require("./config")), (port = config.port);

let handlebars = exphbs.create({
  helpers: helpers,
  defaultLayout: "main"
});

let meta = {
  year: new Date().getFullYear()
};

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// Define directory from which static files are served
app.use(express.static("public"));

let projects;
fs.readFile("projects.json", "utf8", function(err, data) {
  if (err) throw err;
  projects = JSON.parse(data);

  app.get("/", function(req, res) {
    res.render("home", {
      pageName: "home",
      meta: meta
    });
  });

  app.get("/styleguide", function(req, res) {
    res.render("styleguide", {
      pageName: "styleguide",
      meta: meta
    });
  });

  app.get("/portfolio", function(req, res) {
    res.render("project-overview", {
      pageName: "portfolio",
      meta: meta,
      categories: projects,
      title: "Portfolio"
    });
  });

  app.get("/portfolio/:categorySlug", function(req, res) {
    let categorySlug = req.params.categorySlug;
    let categories = [];
    categories.push(projects[categorySlug]);

    res.render("project-overview", {
      pageName: "portfolio",
      meta: meta,
      categorySlug: categorySlug,
      categories: categories,
      title: categories[0].name + " portfolio"
    });
  });

  app.get("/project/:categorySlug/:projectSlug", function(req, res) {
    res.render("project-detail", {
      pageName: "portfolio",
      meta: meta
    });
  });

  app.get("/contact", function(req, res) {
    res.render("contact", {
      pageName: "contact",
      meta: meta
    });
  });

  http.listen(port, function() {
    console.log("Server listening on port " + port);
  });
});
