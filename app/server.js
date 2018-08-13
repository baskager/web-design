const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  debug = require("debug")("kager-server"),
  exphbs = require("express-handlebars"),
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
  helpers: {
    equal: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  },
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
  /*
     * Date: 13-08-2018
     * Author: Bas Kager
     * 
     * Receiving endpoint for contact form data. Returns JSON on 
     * AJAX requests and a landing page on non-AJAX requests
    */
  app.post("/contact", urlencodedParser, function(req, res) {
    console.log("incoming request");
    // Get the form mapping for the contact form (contains validation rules)
    contactFormMap
      .get()
      .then(map => {
        // Compare the request body with the validation rules on the inputs
        let validatedData = validator.validateInputs(map, req.body);
        // Check if the incoming request is an XMLHTTP Request
        if (req.xhr) {
          res.setHeader("Content-Type", "application/json");
          res.send(JSON.stringify(validatedData));
        } else {
          res.render("contact", {
            pageName: "contact",
            meta: meta,
            validatedData: validatedData
          });
        }
      })
      .catch(error => {
        // Check if the incoming request is an XMLHTTP Request
        if (req.xhr) {
          res.status(500);
          res.setHeader("Content-Type", "application/json");
          res.send(JSON.stringify(error));
        } else {
          res.render("contact", {
            pageName: "contact",
            meta: meta,
            error: error
          });
        }
      });
  });

  http.listen(port, function() {
    console.log("Server listening on port http://localhost:" + port);
  });
});

addslashes = str => {
  return (str + "").replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
};
