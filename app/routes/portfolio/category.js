const PortfolioController = require("../../controllers/portfolio/PortfolioController.class");

module.exports = (request, response, next) => {
  const controller = new PortfolioController(request, response, next);
  controller.renderCategory();
};