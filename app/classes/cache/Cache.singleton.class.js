const fileSystem = require("fs"),
  config = require("../config/Config.singleton.class");

class Cache {
  constructor() {
    let cacheFromFile = this.readFromFile();
    if (cacheFromFile) {
      const amountComponentsCached = Object.keys(cacheFromFile).length;
      // TODO: Extract to Log class
      console.info(amountComponentsCached + " component(s) cached, initialising cache...");
      this.cache = cacheFromFile;
    } else {
      // TODO: Extract to Log class
      console.info("No cache is available, starting server with empty cache...");
      this.cache = {};
    }
  }

  readFromFile(fileName = config.get("cache.defaultFile")) {
    const path = config.get("cache.location") + fileName;
    // TODO: Extract to Log class
    console.info("Reading cache from: " + path);

    // TODO: Check this out in week 7 for Error handling, should probably return an exception.
    if (fileSystem.existsSync(path)) {
      return JSON.parse(fileSystem.readFileSync(path, "utf8"));
    } else return null;
  }

  getAll() {
    return this.cache;
  }

  get(componentName, id) {
    if (this.exists(componentName, id)) {
      return this.cache[componentName][id];
    } else throw new ReferenceError(
      // TODO: Extract to Log class
      "Cache entry for component \"" + componentName + "\" with id: \"" + id + "\" does not exists"
    );
  }

  exists(componentName, id) {
    return  this.componentExists(componentName) && 
            this.entryExists(componentName, id);
  }

  componentExists(componentName) {
    return this.cache[componentName] !== undefined;
  }

  entryExists(componentName, id) {
    return this.cache[componentName][id] !== undefined;
  }

  saveToFile(fileName = config.get("cache.defaultFile")) {
    const path = config.get("cache.location") + fileName;
    // TODO: Extract to Log class
    console.info("Writing cache to: " + path);

    fileSystem.writeFile(path, JSON.stringify(this.cache), "utf8", err => {
      if (err) throw err;
      // TODO: Extract to Log class
      console.info("Cache written to: " + path);
    });
  }

  add(componentName, id, data) {
    if (!this.componentExists(componentName)) {
      this.addComponent(componentName);
    }
    this.cache[componentName][id] = data;
  }

  addComponent(componentName) {
    this.cache[componentName] = {};
  }
}
module.exports = new Cache();