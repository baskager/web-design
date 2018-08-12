const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  debug = require("debug")("kager-server"),
  exphbs = require("express-handlebars"),
  helpers = require("./lib/helpers"),
  fs = require("fs"),
  bodyParser = require("body-parser"),
  config = require("./config"),
  port = config.port || 3000,
  urlencodedParser = bodyParser.urlencoded({ extended: false }),
  querystring = require("querystring"),
  components = require("./components")(config),
  validator = new components.Validator();

const contactFormMap = new components.FormMapper(
  "views/partials/forms/contact.handlebars"
);

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

  app.post("/contact/send", urlencodedParser, function(req, res) {
    let params = {};
    let errors = [];

    contactFormMap
      .get()
      .then(map => {
        validator.validateInputs(map, req.body);
      })
      .catch(error => {
        // redirectWithError();
        console.dir(error);
      });

    for (param in req.body) {
      let value = req.body[param];

      if (value !== "") params[param] = this.addslashes(value);
    }

    if (params.name && params.message && params.email) {
      // console.dir(req.body);
      let status = {};
      status.title = "You made it!";
      status.message =
        "Your message has been delivered safely and you can expect a reply shortly.";

      res.render("contact-landing", {
        pageName: "contact",
        meta: meta,
        status: status
      });
    } else {
      res.writeHead(301, {
        Location: encodeURI(
          "/contact?error=& \
          name=" +
            req.body.name +
            "& \
          message=" +
            req.body.message +
            "& \
          email=" +
            req.body.email
        )
      });
      res.end();
    }

    // let query = querystring.stringify(params);

    // console.dir(query);
  });

  http.listen(port, function() {
    console.log("Server listening on port http://localhost:" + port);
  });
});

addslashes = str => {
  return (str + "").replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
};
