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

const handlebars = exphbs.create({
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

const mailer = new components.Mailer(handlebars);

const meta = {
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

  renderContactAfterFormSubmission = (req, res, data, error) => {
    if (req.xhr) {
      res.setHeader("Content-Type", "application/json");
      data.error = error;
      res.send(JSON.stringify(data));
    } else {
      res.render("contact", {
        pageName: "contact",
        meta: meta,
        validatedData: data,
        error: error
      });
    }
  };
  /*
     * Date: 13-08-2018
     * Author: Bas Kager
     * 
     * Receiving endpoint for contact form data. Returns JSON on 
     * AJAX requests and a landing page on non-AJAX requests
    */
  app.post("/contact", urlencodedParser, function(req, res) {
    // Get the form mapping for the contact form (contains validation rules)
    contactFormMap
      .get()
      .then(map => {
        // Compare the request body with the validation rules on the inputs
        let validatedData = validator.validateInputs(map, req.body);
        // Send the email if all validations were passed
        if (!validatedData.isError) {
          mailer
            .send({
              mailoptions: {
                to: config.mailer.contactAdress,
                from: validatedData.inputs.email.value,
                subject: "New message from " + validatedData.inputs.name.value
              },
              template: {
                name: "contact",
                context: { validatedData }
              }
            })
            .then(result => {
              console.dir(result);
              renderContactAfterFormSubmission(req, res, validatedData);
            })
            .catch(error => {
              console.dir(error);
              // Re-render contact page if an error occurs and pass the error object along
              renderContactAfterFormSubmission(req, res, validatedData, error);
            });
          // Re-render contact page with data if inputs did not pass validations
        } else renderContactAfterFormSubmission(req, res, validatedData);
      })
      .catch(error => {
        console.dir(error);
        // Re-render contact page if an error occurs and pass the error object along
        renderContactAfterFormSubmission(req, res, null, error);
      });
  });

  mailer.verify().then(success => {
    console.info("SMTP SUCCESS: configuration verified");
    http.listen(port, function() {
      console.log("Server listening on port http://localhost:" + port);
    });
  });
});
