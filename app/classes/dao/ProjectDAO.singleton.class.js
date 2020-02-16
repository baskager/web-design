class ProjectDAO {
  constructor() {
    this.projects = require("../../storage/projects");
  }

  getAll() {
    return this.projects;
  }

  getByCategoryId(categoryId) {
    return this.projects.filter(project => {
      return project.categoryId === categoryId;
    });
  }

  getBySlug(slug) {
    return this.projects.find(project => {
      return project.slug === slug;
    });
  }

}
module.exports = new ProjectDAO();