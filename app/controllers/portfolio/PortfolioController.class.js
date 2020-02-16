const categoryDao = require('../../classes/dao/CategoryDAO.singleton.class'),
  projectDao = require('../../classes/dao/ProjectDAO.singleton.class');

module.exports = class PortfolioController {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  renderOverview() {
    this.response.render("project-overview", {
      pageName: "portfolio",
      categories: categoryDao.getAll(),
      projects: projectDao.getAll(),
      title: "Portfolio"
    });
  }

  renderCategory() {
    const categorySlug = this.request.params.slug;
    const category = categoryDao.getBySlug(categorySlug);

    this.response.render("project-overview", {
      pageName: "portfolio",
      categorySlug: category.slug,
      categories: categoryDao.getAll(),
      projects: projectDao.getByCategoryId(category.id),
      title: "Portfolio",
      subtitle: category.name + " projects"
    });
  }
}