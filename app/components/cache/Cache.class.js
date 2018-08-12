const fs = require("fs");
module.exports = function(config) {
  class Cache {
    constructor() {
      let cacheFromFile = this.loadFromFile("main.json");
      this.components = {};
    }

    get(componentName, id) {
      if (
        this.components[componentName] &&
        this.components[componentName][id]
      ) {
        return this.components[componentName][id];
      }
    }

    getAll() {
      return this.components;
    }

    loadFromFile(fileName) {}

    saveToFile(fileName) {
      console.log();
    }
    /*
     * Date: 12-08-2018
     * Author: Bas Kager
     * 
     * Add an item to the cache object
    */
    add(componentName, id, data) {
      // Create cache entry if it doesn't exist yet
      if (!this.components[componentName]) this.components[componentName] = {};

      this.components[componentName][id] = data;
    }

    // clear(componentName) {}

    // clearAll() {}
  } // END OF CLASS

  return Cache;
}; // END OF FUNCTION
