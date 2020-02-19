const projectDao = require("../../classes/dao/ProjectDAO.singleton.class"),
  Log = require("../../classes/log/Log.class");

module.exports = class PortfolioController {
  constructor(request, response, next) {
    this.request = request;
    this.response = response;
    this.next = next;
  }

  renderTemplateWithProject(project) {
    this.response.render("project-detail", {
      pageName: "portfolio",
      project: project
    });
  }

  renderDetails() {
    const projectSlug = this.request.params.projectSlug;
    Log.breadCrumb("project", "Retrieving project from storage");

    try {
      const project = projectDao.getBySlug(projectSlug);
      this.renderTemplateWithProject(project);
    } catch(exception) {
      Log.suspicion(exception.message);
      // Ignore this route alltogether
      return this.next();
    }
  }
};