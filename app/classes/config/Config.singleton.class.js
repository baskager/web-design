fs = require("fs");

class Config {

  constructor() {
    this.config = require("../../config");
  }

  set(propertyName, value) {
    const branches = propertyName.split( "." );
    let root = this.config;

    branches.forEach( (branch, index) => {
      if(root[branch] === undefined) {
        root[branch] = {};
      }

      if(index === (branches.length-1)) {
        root[branch] = value;
      }

      root = root[branch];
    });
  }

  get(propertyName) {
    if(!propertyName) {
      return this.config;
    }
  
    const branches = propertyName.split( "." );
    let root = this.config;
  
    branches.forEach(branch => {
      root = root[branch];
    });
  
    return root;
  }

}
module.exports = new Config();