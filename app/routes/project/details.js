const ProjectController = require("../../controllers/project/ProjectController.class");

module.exports = (request, response, next) => {
  const controller = new ProjectController(request, response, next);
  controller.renderDetails();
};