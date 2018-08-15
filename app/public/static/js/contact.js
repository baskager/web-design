/**
 * Live search filter
 *
 * @author  Bas Kager
 * @version 1.0
 * @since   14-08-2018
 */
(function() {
  var prefix = "v-";
  var form = document.querySelector("#contactForm");
  var inputs = form.querySelectorAll("[" + prefix + "map='true']");
  var button = form.querySelector("button");
  var errors = [];
  // Hide the button
  button.disabled = true;

  for (var i = 0; i <= inputs.length - 1; i++) {
    console.dir(i);
    inputs[i].addEventListener("input", function(e) {
      if (validateAll()) {
        button.disabled = false;
        button.addEventListener("click", function(e) {
          e.preventDefault();
          console.log("sending ajax request");
        });
      } else {
        button.disabled = true;
      }
    });
  }

  _checkMinValue = function(input) {
    return input.value.length >= input.minLength;
  };
  _checkMaxValue = function(input) {
    return input.value.length <= input.maxLength;
  };
  _checkEmail = function(input) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(input.value).toLowerCase());
  };

  validateInput = function(input, options = { logErrors: false }) {
    var valid = true;
    if (!_checkMinValue(input)) {
      valid = false;
    }
    if (!_checkMaxValue(input)) {
      valid = false;
    }
    if (input.type === "email") {
      if (!_checkEmail(input)) valid = false;
    }
    return valid;
  };
  validateAll = function(options = { logErrors: false }) {
    var valid = true;
    // Loop trough all the inputs and validate them one by one
    for (var i = 0; i <= inputs.length - 1; i++) {
      var input = inputs[i];
      valid = validateInput(input, options);

      if (!valid && input.value.length !== 0) {
        input.classList.add("invalid");
      } else input.classList.remove("invalid");

      if (valid) {
        input.classList.add("valid");
      } else input.classList.remove("valid");

      if (input.name === "name" && valid) {
        inputs[1].placeholder =
          input.value + " is a lovely name, please write your message here";
      }
      if (input.name === "name" && !valid) inputs[1].placeholder = "Message";

      if (input.name === "message" && valid) {
        inputs[2].placeholder =
          "Great stuff! Just need your e-mail address now";
      }
      if (input.name === "message" && !valid)
        inputs[2].placeholder = "Email address";
    }
    return valid;
  };
  /* Check if all fields validate, this ensures that when a user refreshes 
   * a page with data, the button is not wrongfully disabled */
  if (validateAll()) {
    button.disabled = false;
    button.addEventListener("click", function(event) {
      console.log("sending ajax request");
      console.dir(errors);
    });
  }
})();
