const categoryDao = require("../../classes/dao/CategoryDAO.singleton.class"),
  projectDao = require("../../classes/dao/ProjectDAO.singleton.class"),
  Log = require("../../classes/log/Log.class");

module.exports = class PortfolioController {
  constructor(request, response, next) {
    this.request = request;
    this.response = response;
    this.next = next;
  }

  renderOverview() {
    this.response.render("project-overview", {
      pageName: "portfolio",
      categories: categoryDao.getAll(),
      projects: projectDao.getAllWithCategories(),
      title: "Portfolio"
    });
  }

  renderTemplateWithCategory(category) {
    const projects = projectDao.getByCategoryId(category.id);
    const projectsWithCategories = projectDao.mapRelatedCategories(projects);

    this.response.render("project-overview", {
      pageName: "portfolio",
      categorySlug: category.slug,
      categories: categoryDao.getAll(),
      projects: projectsWithCategories,
      title: "Portfolio",
      subtitle: category.name + " projects"
    });
  }

  renderCategory() {
    const categorySlug = this.request.params.slug;

    try {
      const category = categoryDao.getBySlug(categorySlug);
      this.renderTemplateWithCategory(category);
    } catch(exception) {
      Log.suspicion(exception.message);
      // Ignore this route alltogether
      return this.next();
    }

  }
};