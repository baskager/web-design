/**
 * Contact form enhancements
 *
 * @author  Bas Kager
 * @version 1.0
 * @since   14-08-2018
 */
(function() {
  var prefix = "v-";
  var form = document.querySelector("#contactForm");
  var loadingScreen = document.querySelector("#load");
  var successScreen = document.querySelector("#success");
  var errorScreen = document.querySelector("#error");
  var inputs = form.querySelectorAll("[" + prefix + "map='true']");
  var button = form.querySelector("button");
  var closeScreenButtons = form.querySelectorAll(".close");

  var app = {
    linkedInUrl: "http://linkedin.com/in/sebastiaan-kager",
    contactEndpoint: "/contact",
    retryCountdowntime: 10,
    retryAmount: 2,
    retries: 0
  };
  // Hide the button
  button.disabled = true;

  /**
   * Object which handles the states of the form screens.
   *
   * @since: 19-08-2018
   * @author: Bas Kager
   */
  var screen = {
    /**
     * Displays a screen
     *
     * @since: 15-08-2018
     * @author: Bas Kager
     * @param {string} screenName - The name of the screen to be displayed.
     */
    show: function(screenName) {
      var el = document.querySelector("#" + screenName);
      el.style.zIndex = 99;
      el.style.opacity = 1;
    },
    /**
     * Hides a screen
     *
     * @since: 15-08-2018
     * @author: Bas Kager
     * @param {string} screenName - The name of the screen to be hidden.
     */
    hide: function(screenName) {
      var el = document.querySelector("#" + screenName);
      el.style.zIndex = -1;
      el.style.opacity = 0;
    },
    /**
     * Hides all screens
     *
     * @since: 15-08-2018
     * @author: Bas Kager
     */
    hideAll: function() {
      var screens = form.querySelectorAll(".loading-info");
      for (var i = 0; i < screens.length; i++) {
        var el = screens[i];

        el.style.zIndex = -1;
        el.style.opacity = 0;
      }
    },
    /**
     * Sets the message in a screen, clears older messages in the screen.
     *
     * @since: 16-08-2018
     * @author: Bas Kager
     * @param {string} screenName - The name of the screen the message will be added to.
     * @param {string} message - The message that will be set.
     */
    setMessage: function(screenName, message) {
      var el = document.querySelector("#" + screenName);
      el.querySelector("#message").innerHTML = message;
    },
    /**
     * Adds a message to a screen without clearing older messages.
     *
     * @since: 16-08-2018
     * @author: Bas Kager
     * @param {string} screenName - The name of the screen the message will be added to.
     * @param {string} message - The message that will be added.
     */
    addMessage: function(screenName, message) {
      var el = document.querySelector("#" + screenName);
      el.querySelector("#message").innerHTML += message;
    },
    /**
     * Clears all messages in a screen
     *
     * @since: 16-08-2018
     * @author: Bas Kager
     * @param {string} screenName - The name of the screen that will be cleared.
     */
    clearMessage: function(screenName) {
      var el = document.querySelector("#" + screenName);
      el.querySelector("#message").innerHTML += "";
    }
  };
  // Validate inputs while the user is typing
  for (var i = 0; i <= inputs.length - 1; i++) {
    inputs[i].addEventListener("input", function(e) {
      validateAll();
    });
  }
  // Add a "click" event to the form button which submits the form inputs
  button.addEventListener("click", function(event) {
    event.preventDefault();

    var name = inputs[0].value;
    var message = inputs[1].value;
    var email = inputs[2].value;

    submit(name, message, email, false);
  });
  /**
   * Recursive function which creates and handles a XMLHTTP request with the form data.
   * The function will call itself if the request was not successful.
   *
   * It will retry by the amount of times set in the app object
   * with an interval which is also set in the "app" object.
   *
   * The function will stop calling itself if:
   *  - The request was successful
   *  - It retried the maximum amount of times set in app.retryAmount
   *
   * @since: 16-08-2018
   * @author: Bas Kager
   * @param {string} name - The input contents of the 'name' field
   * @param {string} message - The input contents of the 'message' field
   * @param {string} email - The input contents of the 'email' field
   * @param {boolean} isSuccess - Wether an earlier request was successful or not
   */
  submit = function(name, message, email, isSuccess) {
    // Disable all inputs
    setDisabledAll();
    form.style.zIndex = 0;

    var xhr = new XMLHttpRequest();
    screen.hide("error");
    screen.show("load");

    xhr.open("POST", app.contactEndpoint, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("xhr", "true");

    xhr.onreadystatechange = function() {
      app.lastStatus = this.status;

      if (this.readyState == XMLHttpRequest.DONE) {
        if (app.lastStatus) app.lastResponse = JSON.parse(this.responseText);
        else app.lastResponse = null;

        app.retries++;
        _renderStatus(app.lastStatus, app.lastResponse, app.retries);

        if (app.lastStatus === 200) {
          isSuccess = true;
        } else {
          var timeLeft = app.retryCountdowntime;

          if (app.retries <= app.retryAmount) {
            var retryTimer = setInterval(function() {
              timeLeft--;
              _renderStatus(
                app.lastStatus,
                app.lastResponse,
                app.retries,
                timeLeft
              );
              if (timeLeft === 1) {
                screen.hide("error");
                screen.show("load");
              }
              if (timeLeft <= 0) {
                clearInterval(retryTimer);
                submit(name, message, email, isSuccess);
              }
            }, 1000);
          }
        }
      }
    };

    xhr.send("name=" + name + "&message=" + message + "&email=" + email);
  };
  /**
   * Renders the result of the XMLHTTP request to the client.
   *
   * @since: 19-08-2018
   * @author: Bas Kager
   * @param {int} status - The status code returned by the request
   * @param {object} response - The response object
   * @param {int} retries - *optional* the number of retried requests
   * @param {int} timeLeft - *optional* the amount of seconds left untill the next retry
   */
  _renderStatus = function(status, response, retries, timeLeft) {
    //Call a function when the state changes
    if (status === 200) {
      screen.hide("load");
      screen.hide("error");
      screen.show("success");
    } else {
      screen.hide("load");
      // The server could not initialize the validation mappings
      if (
        response &&
        response.error &&
        response.error.type === "validation_map_init"
      ) {
        screen.setMessage("error", "The server could not process your data.");
      }
      // The mail service responded with an error
      if (response && response.error && response.error.type === "mailer") {
        screen.setMessage("error", "An error occured while sending the email.");
      }
      /* 
      * If the response is empty it generally means there is no connection.
      * 
      * Possible explainations for this error:
      *   - Server could be down
      *   - Client has an unstable connection
      *   - Client went offline
      */
      if (response === null) {
        screen.setMessage("error", "Could not connect to the server");
      }
      /* 
      * If the back-end validations do not match with the front-end validations
      * Don't retry sending the data and inform the user that something went wrong.
      * 
      * Possible explainations for this error:
      *   - Someone could be attempting to hijack the form.
      *   - There is a bug in the validation mapper, retrying won't help.
      */
      if (status === 400) {
        screen.setMessage("error", "The server could not verify your inputs");
        app.retries = app.retryAmount + 1;
        retries = app.retryAmount + 1;
      }
      /* 
      * Notify the client that the action will be retried.
      * Apologize after two retries and offer an alternative (linkedIn)
      */
      if (retries <= app.retryAmount) {
        screen.addMessage(
          "error",
          "<br> Retrying again in " +
            timeLeft +
            " seconds. <br><br><b>Attempt " +
            retries +
            "</b>"
        );
      } else {
        enableCloseScreenButton();
        screen.addMessage(
          "error",
          "<br><br> Please feel free to contact me on my <a target='_blank' href='" +
            app.linkedInUrl +
            "'>LinkedIn</a> instead, I am very sorry for the inconvenience." +
            "<br><br> <i>The occurance has been logged and I will review the issue.</i>"
        );
      }
      screen.show("error");
    }
    return false;
  };
  /**
   * Checks the minimum character length of an input
   *
   * @since: 15-08-2018
   * @author: Bas Kager
   * @param {HTMLInputElement} input - The input element to be validated
   */
  _checkMinValue = function(input) {
    return input.value.length >= input.minLength;
  };
  /**
   * Checks the maximum character length of an input
   *
   * @since: 15-08-2018
   * @author: Bas Kager
   * @param {HTMLInputElement} input - The input element to be validated
   */
  _checkMaxValue = function(input) {
    return input.value.length <= input.maxLength;
  };
  /**
   * Checks if the input value is an email address
   *
   * @since: 15-08-2018
   * @author: Bas Kager
   * @param {HTMLInputElement} input - The input element to be validated
   */
  _checkEmail = function(input) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(input.value).toLowerCase());
  };
  /**
   * Sets the disabled attribute on all inputs of the form
   *
   * @since: 15-08-2018
   * @author: Bas Kager
   * @param {boolean} value - The value to be set
   */
  setDisabledAll = function(value) {
    if (value === null || value === undefined) value = false;

    for (var i = 0; i <= inputs.length - 1; i++) {
      var input = inputs[i];
      input.disabled = value;
    }
    button.disabled = value;
  };

  /**
   * Enables the close button on screens that contain one
   *
   * @since: 20-08-2018
   * @author: Bas Kager
   */
  enableCloseScreenButton = function() {
    for (var i = 0; i < closeScreenButtons.length; i++) {
      closeScreenButtons[i].addEventListener("click", function(event) {
        event.preventDefault();
        setDisabledAll(false);
        screen.hideAll();
        app.retries = 0;
        disableCloseScreenButton();
      });
      closeScreenButtons[i].style.display = "block";
    }
  };
  /**
   * disabled the close button on screens that contain one
   *
   * @since: 20-08-2018
   * @author: Bas Kager
   */
  disableCloseScreenButton = function() {
    for (var i = 0; i < closeScreenButtons.length; i++) {
      closeScreenButtons[i].style.display = "none";
    }
  };

  /**
   * Clears all inputs
   *
   * @since: 15-08-2018
   * @author: Bas Kager
   */
  clearInputs = function() {
    for (var i = 0; i <= inputs.length - 1; i++) {
      var input = inputs[i];
      input.value = "";
    }
    // Reset the validations
    validateAll();
  };
  /**
   * Validates a single input element
   *
   * @since: 16-08-2018
   * @author: Bas Kager
   * @param {HTMLInputElement} input - The input element to be validated
   */
  validateInput = function(input) {
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
  /**
   * Validates all input elements
   *
   * @since: 16-08-2018
   * @author: Bas Kager
   */
  validateAll = function() {
    var valid = true;
    // Loop trough all the inputs and validate them one by one
    for (var i = 0; i <= inputs.length - 1; i++) {
      var input = inputs[i];
      valid = validateInput(input);

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

    if (valid) button.disabled = false;
    else button.disabled = true;

    return valid;
  };
  /* 
   * Check if all fields validate, this ensures that when a user refreshes 
   * a page with data, the button is not wrongfully disabled 
  */
  validateAll();
})();
