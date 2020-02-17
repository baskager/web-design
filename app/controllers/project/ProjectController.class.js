const projectDao = require("../../classes/dao/ProjectDAO.singleton.class");

module.exports = class PortfolioController {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  renderDetails() {
    const projectSlug = this.request.params.projectSlug;
    this.response.render("project-detail", {
      pageName: "portfolio",
      project: projectDao.getBySlug(projectSlug)
    });
  }
};