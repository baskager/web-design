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
  //   button.innerText = "Continue";
  //   messageInput.style.display = "none";
  //   emailInput.style.display = "none";
  // Hide the button
  button.disabled = true;
  //   button.style.marginTop = "5em";

  console.dir(inputs);

  for (var i = 0; i <= inputs.length - 1; i++) {
    console.dir(i);
    inputs[i].addEventListener("input", function(e) {
      if (validateInput(this)) {
        this.classList.add("valid");
      } else {
        this.classList.remove("valid");
      }

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
