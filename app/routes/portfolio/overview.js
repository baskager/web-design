const categoryDao = require('../../classes/dao/CategoryDAO.singleton.class'),
  projectDao = require('../../classes/dao/ProjectDAO.singleton.class');

module.exports = (req, res) => {
  res.render("project-overview", {
    pageName: "portfolio",
    categories: categoryDao.getAll(),
    projects: projectDao.getAll(),
    title: "Portfolio"
  });
};