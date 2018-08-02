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
  var list = document.querySelectorAll(".project-list");

  input.addEventListener("focus", function(event) {
    for (var i = 0; i <= thumbnails.length - 1; i++) {
      thumbnails[i].classList.add("faded");
    }
  });

  input.addEventListener("blur", function(event) {
    var searchResults = document.querySelectorAll(".searchResult");

    for (var i = 0; i <= searchResults.length - 1; i++) {
      main.removeChild(searchResults[i]);
    }

    for (var i = 0; i <= thumbnails.length - 1; i++) {
      thumbnails[i].classList.remove("hide");
    }

    for (var i = 0; i <= thumbnails.length - 1; i++) {
      thumbnails[i].classList.remove("faded");
    }
  });

  input.addEventListener("input", function(event) {
    filter = input.value.toUpperCase();
    results = 0;

    for (var i = 0; i <= thumbnails.length - 1; i++) {
      var thumbnail = thumbnails[i];
      var title = thumbnail.querySelector("#title").innerText.toUpperCase();
      // var tags = thumbnail.querySelectorAll('#tags');

      // for (var a = 0; a <= tags.length - 1; a++) {
      //   console.log(tags[a].innerText);
      // }

      if (title.indexOf(filter) > -1 || title.indexOf(filter) > -1) {
        thumbnail.classList.remove("hide");
        results++;
      } else {
        thumbnail.classList.add("hide");
      }
      // thumbnailRows[i].classList.add("hide");
    }
    if (results === 1) {
      list[0].classList.add("oneResult");
    } else {
      list[0].classList.remove("oneResult");
    }
    // var newRow = document.createElement("section");
    // newRow.classList.add("center", "flex", "thumbnail-row", "searchResult", "oneResult");

    // var clone = thumbnails[1].cloneNode(true);
    // clone.classList.remove("faded");

    // newRow.appendChild(clone);

    // mainContainer.appendChild(newRow);
  });
})();
