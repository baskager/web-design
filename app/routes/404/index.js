const GenericTemplateController = require("../../controllers/generic/GenericTemplateController.class");

module.exports = (request, response) => {
  response.status(404);
  const genericTemplateController = new GenericTemplateController(request, response);
  genericTemplateController.render("error", "404" ,"Page not found");
};