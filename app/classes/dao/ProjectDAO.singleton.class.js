const categoryDao = require("../../classes/dao/CategoryDAO.singleton.class"),
  cloneDeep = require("clone-deep");
class ProjectDAO {
  constructor() {
    this.projects = require("../../storage/projects");
    this.initializeRelations();
    this.sortByYear();
  }

  initializeRelations() {
    this.projects.map(project => {
      project.relations = {};
    });
  }

  sortByYear() {
    this.projects.sort((a, b) => {
      return a.year < b.year;
    });
  }

  getAll() {
    return this.projects;
  }

  getAllWithCategories() {
    const projects = this.getAll();
    return this.mapRelatedCategories(projects);
  }

  mapRelatedCategories(projects) {
    const projectsCopy = cloneDeep(projects);

    projectsCopy.map(project => {
      project.relations.category = categoryDao.getById(project.categoryId);
    });

    return projectsCopy;
  }

  getByCategoryId(categoryId) {
    return this.projects.filter(project => {
      return project.categoryId === categoryId;
    });
  }

  getBySlug(slug) {
    const project = this.projects.find(project => {
      return project.slug === slug;
    });

    if(!project) {
      throw Error("Could not find project with slug: " + slug);
    }
    
    return project;
  }

}
module.exports = new ProjectDAO();