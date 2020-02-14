const categoryDao = require('../../classes/dao/CategoryDAO.singleton.class'),
  projectDao = require('../../classes/dao/ProjectDAO.singleton.class');

module.exports = (req, res) => {
  const category = categoryDao.getBySlug(req.params.slug);

  res.render("project-overview", {
    pageName: "portfolio",
    categorySlug: category.slug,
    categories: categoryDao.getAll(),
    projects: projectDao.getByCategoryId(category.id),
    title: "Portfolio",
    subtitle: category.name + " projects"
  });
};