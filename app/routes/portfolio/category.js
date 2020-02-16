const PortfolioController = require("../../controllers/portfolio/PortfolioController.class");

module.exports = (request, response) => {
  const controller = new PortfolioController(request, response);
  controller.renderCategory();
};