/**
 * Function that loads custom libraries
 *
 * @since: 12-08-2018
 * @author: Bas Kager
 */
module.exports = function(config) {
  const Cache = require("./cache/Cache.class")(config.cache);
  let cache = new Cache();
  let environment = config.environment;
  return {
    FormMapFactory: require("./forms/FormMapFactory.class")(config.formMapper, cache),
    Validator: require("./forms/Validator.class")(config.validator, cache),
    Mailer: require("./mailer/Mailer.class")(config.mailer, cache, environment),
    cache: cache
  };
};
