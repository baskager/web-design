const GenericTemplateController = require("../../controllers/generic/GenericTemplateController.class");

module.exports = (request, response) => {
  const controller = new GenericTemplateController(request, response);
  controller.render("contact", "contact");
};