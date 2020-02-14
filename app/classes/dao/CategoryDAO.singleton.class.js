class CategoryDAO {
  constructor() {
    this.categories = require("../../storage/categories");
  }
  getAll() {
    return this.categories;
  }

  getBySlug(slug) {
    return this.categories.find(category => {
      return category.slug === slug;
    });
  }

}
// Singleton instance
module.exports = new CategoryDAO();