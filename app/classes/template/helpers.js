module.exports = {
    // Allows comparing two values within a template, like if(a===b)
    equal: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    copyrightYear: function() {
      return new Date().getFullYear();
    }
}