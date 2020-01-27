const express = require("express"),
  app = express(),
  Raven = require("raven"),
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

// Define directory from which static files are served
app.use(express.static("public"));

// Initialise cross-site metadata
const meta = {
  year: new Date().getFullYear()
};

// Set up sentry.io logging
Raven.config(
  "https://87770093195c4c6a87c342a87dfe4e59@sentry.io/1274336"
).install();

// Initialise the map object for the 'contact form' validations
const contactFormMap = new components.FormMapper(
  "views/partials/forms/contact.handlebars"
);
// Initialise handlebars
const handlebars = exphbs.create({
  extName: '.handlebars',
  partialsDir: 'views/partials',
  layoutsDir: 'views',
  helpers: {
        // Allows comparing two values, like if(a===b)
    equal: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  },
  defaultLayout: "main"
});
// Initialise mailer with the handlebars object, which uses handlebars to compile the mail templates
const mailer = new components.Mailer(handlebars);

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// Load the projects from the database and initialise paths
fs.readFile("projects.json", "utf8", function(err, projectsJSON) {
  if (err) throw err;
  projects = JSON.parse(projectsJSON);

  // Change all server paths here
  let paths = {
    home: "/",
    styleguide: "/styleguide",
    portfolio: "/portfolio",
    portfolioCategory: "/portfolio/:categorySlug",
    projectDetail: "/project/:categorySlug/:projectSlug",
    contact: "/contact"
  };

  /**
   * Path that renders the homepage
   *
   * @author: Bas Kager
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   */
  app.get(paths.home, function(req, res) {
    res.render("home", {
      pageName: "home",
      meta: meta
    });
  });

  /**
   * Path that renders the portfolio
   *
   * @author: Bas Kager
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   */
  app.get(paths.portfolio, function(req, res) {
    res.render("project-overview", {
      pageName: "portfolio",
      meta: meta,
      categories: projects,
      title: "Portfolio"
    });
  });
  /**
   * Path that renders the portfolio for a certain category
   *
   * @author: Bas Kager
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   */
  app.get(paths.portfolioCategory, function(req, res) {
    let categorySlug = req.params.categorySlug;
    let categories = [];
    categories.push(projects[categorySlug]);

    res.render("project-overview", {
      pageName: "portfolio",
      meta: meta,
      categorySlug: categorySlug,
      categories: categories,
      title: "Portfolio",
      subtitle: categories[0].name + " projects"
    });
  });
  /**
   * Path that renders 'project-detail' pages
   *
   * @author: Bas Kager
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   */
  app.get(paths.projectDetail, function(req, res) {
    let categorySlug = req.params.categorySlug;
    let projectSlug = req.params.projectSlug;

    let category = projects[categorySlug];
    let result = null;

    for (project of category.projects) {
      if (project.slug === projectSlug) {
        result = project;
      }
    }
    if (result) {
      res.render("project-detail", {
        pageName: "portfolio",
        meta: meta,
        project: result
      });
    } else res.redirect(paths.portfolio);
  });
  /**
   * Path that renders the contact page
   *
   * @author: Bas Kager
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   */
  app.get(paths.contact, function(req, res) {
    res.render("contact", {
      pageName: "contact",
      meta: meta
    });
  });
  /**
   * Renders the contact page or returns JSON on form submission
   * depending on wether the request was through XHR or not.
   *
   * @author: Bas Kager
   * @param {Request} req - The request object given by express path
   * @param {Response} res - The response object given by express path
   * @param {Object} data - *optional* Validated data from the contact form
   * @param {Error} error - *optional* Error object
   *
   * @returns {void}
   */
  renderContactAfterFormSubmission = (req, res, data, error) => {
    let xhr = req.headers.xhr === "true";
    let status = 200;
    if (xhr) {
      res.setHeader("Content-Type", "application/json");
      data.error = error;

      // Set status codes on errors
      if (error) status = 500;
      if (data.isValidationError) status = 400;

      res.status(status).send(JSON.stringify(data));
    } else {
      res.render("contact", {
        pageName: "contact",
        meta: meta,
        validatedData: data,
        error: error
      });
    }
  };

  /**
   * POST endpoint for the contact form
   *
   * @author: Bas Kager
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   */
  app.post("/contact", urlencodedParser, function(req, res) {
    // Get the form mapping for the contact form (contains validation rules)

    Raven.context(function() {
      Raven.captureBreadcrumb({
        message: "Received data from the contact form",
        category: "contact",
        data: {
          inputs: req.body
        }
      });
      contactFormMap
        .get()
        .then(map => {
          // Compare the request body with the validation rules on the inputs
          let validatedData = validator.validateInputs(map, req.body);
          // Send the email if all validations were passed
          if (!validatedData.isValidationError) {
            mailer
              .send({
                mailoptions: {
                  to: config.mailer.contactAdress,
                  from:
                    validatedData.inputs.name.value +
                    " <" +
                    validatedData.inputs.email.value +
                    ">",
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
              .catch(mailerError => {
                Raven.captureException(mailerError);
                let error = {};
                error.type = "mailer";
                error.info = mailerError;
                debug(mailerError);

                // Re-render contact page if an error occurs and pass the error object along
                renderContactAfterFormSubmission(
                  req,
                  res,
                  validatedData,
                  error
                );
              });
            // Re-render contact page with data if inputs did not pass validations
          } else {
            Raven.captureException(validatedData);
            renderContactAfterFormSubmission(req, res, validatedData);
          };
        })
        .catch(mapError => {
          Raven.captureException(mapError);
          let error = {};
          error.type = "validation_map_init";
          error.info = mapError;
          // Re-render contact page if an error occurs and pass the error object along
          renderContactAfterFormSubmission(req, res, {}, error);
        });
    });
  });

  Raven.context(function() {
    let contextData = config.mailer;
    delete contextData.smtp.auth;
    Raven.captureBreadcrumb({
      message: "Verifying SMTP config",
      category: "SMTP",
      data: {
        config: contextData
      }
    });
    mailer
      .verify()
      .then(success => {
        console.info("SMTP SUCCESS: configuration verified");
        console.log("Starting server for environment: " + config.environment);
        http.listen(port, function() {
          console.log("Server listening on port http://localhost:" + port);
        });
      })
      .catch(error => {
        Raven.captureException(error);
      });
  });
});
