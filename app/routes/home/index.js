const GenericTemplateController = require("../../controllers/generic/GenericTemplateController.class");
/**
 * Path that renders the homepage
 *
 * @author: Bas Kager
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

module.exports = (request, response) => {
  const controller = new GenericTemplateController(request, response);
  controller.render("home", "home");
};