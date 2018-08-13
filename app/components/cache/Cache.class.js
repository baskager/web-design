const fs = require("fs");
module.exports = function(config) {
  class Cache {
    constructor() {
      let cacheFromFile = this.readFromFile();
      if (cacheFromFile) {
        console.info(
          " " +
            Object.keys(cacheFromFile).length +
            " components are cached, initialising cache..."
        );
        this.components = cacheFromFile;
      } else {
        console.info(
          "No cache is available, starting server with empty cache..."
        );
        this.components = {};
      }
    }

    get(componentName, id) {
      if (
        this.components[componentName] &&
        this.components[componentName][id]
      ) {
        return this.components[componentName][id];
      } else return null;
    }

    getAll() {
      return this.components;
    }
    /*
     * Date: 12-08-2018
     * Author: Bas Kager
     * 
     * Reads cache from a file
    */
    readFromFile(fileName = config.defaultFile) {
      const path = config.location + fileName;
      console.info("Reading cache from: " + path);
      if (fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path, "utf8"));
      } else return null;
    }
    /*
     * Date: 12-08-2018
     * Author: Bas Kager
     * 
     * Saves cache to a file
    */
    saveToFile(fileName = config.defaultFile) {
      const path = config.location + fileName;
      console.info("Writing cache to: " + path);

      fs.writeFile(path, JSON.stringify(this.components), "utf8", err => {
        if (err) throw err;
        console.info("Cache written to: " + path);
      });
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
