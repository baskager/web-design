/**
 * Live search filter
 *
 * @author  Bas Kager
 * @version 1.0
 * @since   25-04-2018
 */
(function() {
  var input = document.querySelector("#search");
  var mainContainer = document.querySelector("#main");
  var thumbnails = document.querySelectorAll(".thumbnail");
  var projectList = document.querySelectorAll(".project-list");

  input.addEventListener("focus", function(event) {
    for (var i = 0; i <= thumbnails.length - 1; i++) {
      thumbnails[i].classList.add("faded");
      thumbnails[i].classList.add("show");
    }
  });

  input.addEventListener("blur", function(event) {
    for (var i = 0; i <= thumbnails.length - 1; i++) {
      thumbnails[i].classList.remove("faded");
    }
  });

  input.addEventListener("input", function(event) {
    for (var i = 0; i <= thumbnails.length - 1; i++) {
      thumbnails[i].classList.add("faded");
      thumbnails[i].classList.add("show");
    }

    var filter = input.value.toLowerCase();
    var results = 0;
    var lastTitle = "";

    for (var i = 0; i <= thumbnails.length - 1; i++) {
      var thumbnail = thumbnails[i];
      var title = thumbnail.querySelector("#title").innerText.toLowerCase();

      if (title.indexOf(filter) > -1 || title.indexOf(filter) > -1) {
        thumbnail.classList.remove("hide");
        lastIndex = i;
        results++;
      } else {
        thumbnail.classList.add("hide");
      }
    }

    if (results === 1) {
      thumbnails[lastIndex].classList.remove("faded");
    } else {
      thumbnails[lastIndex].classList.add("faded");
    }
  });
})();
