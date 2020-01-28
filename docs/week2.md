# Refactoring report for week 2

![Function name](img/unsplash-function-name.jpg)

I will seperate parts of code into categories described in chapter two of the "clean code" book by Robert C. Martin.

## Intention revealing names and avoiding disinformation

### /app/server.js

```javascript
  renderContactAfterFormSubmission = (req, res, data, error) => {
    let xhr = req.headers.xhr === "true";
    let status = 200;
    if (xhr) {
      res.setHeader("Content-Type", "application/json");
      data.error = error;

      // Set status codes on errors
      if (error) status = 500;
      if (data.isValidationError) status = 400;

      res.status(status).send(JSON.stringify(data));
    } else {
      res.render("contact", {
        pageName: "contact",
        meta: meta,
        validatedData: data,
        error: error
      });
    }
  };
```

The code above, mostly, has names revealing their intention. The contact form has to be rendered again after form submission.

Two variables however, stand out, `xhr` and `meta`.

They reveal little intention about what they do or contain. `xhr` is a boolean indicating that the received request was an XMLHTTPRequest (AJAX). This name however doesn not indicate that the variable is a boolean and checks against an XHR request.

`meta` is even vaguer. It could be anything really, it does not communicate any intention. Reading further into the code it appears that this is data that is given along with each HTML template, such as a year to be displayed in the footer of the page in the copyright notification.

### Disinformation

`meta` and `xhr` are both names that can mean something specific. This might confuse programmers about the intention of the variables. Meta is injected into the template, someone might think these are HTML metatags. `xhr` might be confused as the request itself.

### Code after improvements

```javascript
  renderContactAfterFormSubmission = (req, res, data, error) => {
    let isXHRRequest = req.headers.xhr === "true";
    let status = 200;
    if (isXHRRequest) {
      res.setHeader("Content-Type", "application/json");
      data.error = error;

      // Set status codes on errors
      if (error) status = 500;
      if (data.isValidationError) status = 400;

      res.status(status).send(JSON.stringify(data));
    } else {
      res.render("contact", {
        pageName: "contact",
        commonMetadata: commonTemplateMetadata,
        validatedData: data,
        error: error
      });
    }
  };
```

## Make meaningful distinctions, avoid encodings, class names and method names

### /app/components/forms/FormMapper.class.js

Opinion and improvements are below this fragment.

```javascript
/**
 * Maps an HTML form (which contains validation attributes) into an object
 * to enable server-side validation on the form
 *
 * @since: 12-08-2018
 * @author: Bas Kager
 */
const fs = require("fs"),
  jsdom = require("jsdom"),
  { JSDOM } = jsdom,
  util = require("util");

module.exports = function(config, cache) {
  const prefix = config.prefix;
  class FormMapper {
    /**
     * Constructor, initialises the object with a template file
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} templateFileName Template file of the form to be mapped
     *
     * @returns {void}
     */
    constructor(templateFileName) {
      this.templateFile = templateFileName;
    }
    /**
     * Get the validation map for the form.
     *
     * - Return map if it's already available.
     * - Build map if it's not already available.
     * - Cache map if isCache is 'true' in the HTML form.
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @returns {Object} Validation map object
     */
    get() {
      return new Promise((resolve, reject) => {
        let cachedMap = cache.get("FormMapper", this.templateFile);
        // If map is cached, resolve with the cached map
        if (cachedMap) resolve(cachedMap);
        else {
          // Build map and save to cache if cacheing is enabled on the form
          this._buildMap(this.templateFile)
            .then(map => {
              if (map.isCache) {
                cache.add(this.constructor.name, this.templateFile, map);
                cache.saveToFile();
              }
              resolve(map);
            })
            .catch(err => {
              reject(err);
            });
        }
      });
    }
    /**
     * Builds complete object to make form compatible with
     * validation functions. Can also be cached to validate
     * straight out of memory.
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} templateFile - Name of the template file to be mapped
     *
     * @returns {Object} Validation map object
     */
    _buildMap(templateFile) {
      return new Promise((resolve, reject) => {
        fs.readFile(templateFile, "utf8", (error, html) => {
          if (error) reject(error);

          const dom = new JSDOM(html);

          const formElement = dom.window.document.querySelector("form");
          const inputs = formElement.querySelectorAll(
            "[" + prefix + "map='true']"
          );
          // Map the form metadata
          let map = {
            name: formElement.getAttribute(prefix + "name"),
            version: formElement.getAttribute(prefix + "version"),
            // Converts the string to a boolean
            isCache: formElement.getAttribute(prefix + "cache") === "true",
            inputs: {}
          };
          // Map the input metadata
          map.inputs = this._mapInputs(inputs);

          resolve(map);
        });
      });
    }

    /**
     * Maps inputs for a form to prepare them for validation
     * on future requests
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {Object} inputs - HTMLInputElements from a form
     *
     * @returns {Object} Object containing validation info of inputs
     */
    _mapInputs(inputs) {
      let returnData = {};
      for (let input of inputs) {
        let inputName = input.name;
        let type = input.type;
        let min = input.minLength;
        let max = input.maxLength;
        let placeholder = input.getAttribute("placeholder");
        let botFilter = input.getAttribute(prefix + "filter") === "true";

        // Example: A textarea does not have a type attribute.
        // We need another way to identify what kind of input it is
        if (type === null) {
          type = input.tagName.toLowerCase();
        }

        returnData[inputName] = {
          name: inputName,
          type: type,
          min: min,
          max: max,
          placeholder: placeholder,
          botFilter: botFilter
        };
      }
      return returnData;
    }
  } // END OF CLASS

  return FormMapper;
}; // END OF FUNCTION
```

### The class name

I think `FormMapper` doesn't completely embody the objects that will derive from it. We could also argue that this isn't really an OOP way of working, but that's for a later chapter.

### Meaningful distinctions

`FormMapFactory` would be a class name to inspire better method names. In the ideal OOP situation this class would create actual FormMap objects.

### Method names

Now that the class name has been tackled it is the turn for method names.

`get()` should become -> `create()`
`_buildmap()` should become -> `readFormHTMLTemplate()`
`_mapInputs()` should become -> `createFormInputObjects()`

### Avoid encoding

In renaming the methods above, you might have noticed some underscores `_`. These were used to indicate that methods were private. Vanilla Javascript, however, does not support private methods, so it is useless to include such encoding.

## Use pronounceable names and meaningful context, problem domain and solution domain

Overall names accross the codebase are quite pronounceable. I think a good example in this project is the 'Cache class'. More is written below the code example.

```javascript
/**
 * Caching library that caches data for various software components
 *
 * @author  Bas Kager
 * @version 1.0
 */
const fs = require("fs");
module.exports = function(config) {
  class Cache {
    /**
     * Constructor for the Cache class
     *
     * Reads cache from file, if cache is not available,
     * initialise an empty cache object
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @returns {void}
     */
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
    /**
     * Get cache item for a component
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @param {string} componentName - Name of the cached component
     * @param {string} id - Unique identifier of the cached object
     *
     * @returns {Object} - Cached javascript object
     */
    get(componentName, id) {
      if (
        this.components[componentName] &&
        this.components[componentName][id]
      ) {
        return this.components[componentName][id];
      } else return null;
    }
    /**
     * Get the entire cache object
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @returns {Object} - Cache object
     */
    getAll() {
      return this.components;
    }
    /**
     * Reads cache from a file
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @returns {Object} - Cache object
     */
    readFromFile(fileName = config.defaultFile) {
      const path = config.location + fileName;
      console.info("Reading cache from: " + path);
      if (fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path, "utf8"));
      } else return null;
    }
    /**
     * Saves cache to a file
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @returns {void}
     */
    saveToFile(fileName = config.defaultFile) {
      const path = config.location + fileName;
      console.info("Writing cache to: " + path);

      fs.writeFile(path, JSON.stringify(this.components), "utf8", err => {
        if (err) throw err;
        console.info("Cache written to: " + path);
      });
    }
    /**what
     * Add an item to the cache object
     *
     * @since: 12-08-2018
     * @author: Bas Kager
     *
     * @returns {void}
     */
    add(componentName, id, data) {
      // Create cache entry if it doesn't exist yet
      if (!this.components[componentName]) this.components[componentName] = {};

      this.components[componentName][id] = data;
    }
  } // END OF CLASS

  return Cache;
}; // END OF FUNCTION
```

It is straight to the point and it doesn't contain any weird abbreviations, jokes or puns. It doesn't try to be silly, names represent exactly what should happen.

### Meaningful context

Names have meaningful context, the class and method names help eachother with this. `cache.add` directly communicates what is going to happen. The context of a 'Cache' is communicated by the class name, `add` communicates we will add something to this cache

### Problem and solution domain

In the codebase a lot of words from the solution domain are used. Programmers will understand what is meant with a `Cache`. In this specific project, code is not communicated with non-programmers, so this should be fine.

## Use searchable names

This codebase scores positively on this, For example: in the front-end JavaScript code there very common `e` for `event` is not present. The full word is used.

### app/src/js/contact.js

``` javascript
// Add a "click" event to the form button which submits the form inputs
  button.addEventListener("click", function(event) { // <- Often JavaScript use 'e' here.
```
