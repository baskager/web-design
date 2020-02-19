class CategoryDAO {
  constructor() {
    this.categories = require("../../storage/categories");
    this.initializeRelations();
  }

  initializeRelations() {
    this.categories.map(category => {
      category.relations = {};
    });
  }

  getAll() {
    return this.categories;
  }

  getBySlug(slug) {
    const category =  this.categories.find(category => {
      return category.slug === slug;
    });

    if(!category) {
      throw Error("Could not find category with slug: " + slug);
    }

    return category;
  }

  getById(id) {
    const category =  this.categories.find(category => {
      return category.id === id;
    });

    if(!category) {
      throw Error("Could not find category with id: " + id);
    }

    return category;
  }


}
module.exports = new CategoryDAO();