fs = require("fs");

class Config {

  constructor() {
    this.config = require("../../config");
    // this.set("year", new Date().getFullYear());
  }

  set(propertyName, value) {
    const keys = propertyName.split( "." );
    let property = this.config;

  
    keys.forEach( (key, index) => {
      if(property[key] === undefined) {
        property[key] = {};
      }

      if(index === (keys.length-1)) {
        property[key] = value;
      }

      property = property[key];
    });

  }

  get(propertyName) {
    if(!propertyName) {
      return this.config;
    }
    
    const keys = propertyName.split( "." );
    let property = this.config;
  
    keys.forEach(key => {
      property = property[key];
    });
  
    return property;
  }

}
// Singleton instance
module.exports = new Config();