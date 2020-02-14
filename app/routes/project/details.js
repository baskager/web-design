const projectDao = require('../../classes/dao/ProjectDAO.singleton.class');

module.exports = (req, res) => {
  res.render("project-detail", {
    pageName: "portfolio",
    project: projectDao.getBySlug(req.params.projectSlug)
  });
};