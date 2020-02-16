const ProjectController = require("../../controllers/project/ProjectController.class");

module.exports = (request, response) => {
  const controller = new ProjectController(request, response);
  controller.renderDetails();
};