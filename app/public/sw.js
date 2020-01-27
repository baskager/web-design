var version = "v1.7";

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll([
        "/",
        "/static/fonts/raleway-v4020-bold-webfont.woff",
        "/static/fonts/raleway-v4020-bold-webfont.woff2",
        "/static/fonts/raleway-v4020-regular-webfont.woff",
        "/static/fonts/raleway-v4020-regular-webfont.woff2",
        "/static/fonts/raleway-v4020-thin-webfont.woff",
        "/static/fonts/raleway-v4020-thin-webfont.woff2",
        "/static/css/main.css",
        "/static/js/app.js",
        "/static/js/search.js",
        "/static/js/contact.js",
        "/static/img/baskager-small.jpg",
        "/static/img/icons/bullet-pink.svg",
        "/static/img/icons/correct.svg",
        "/static/img/icons/shocked.svg",
        "/static/img/icons/smile.svg",
        "/static/img/projects/adrmeta-screencap.png",
        "/static/img/projects/cssttr-screencap.png",
        "/static/img/projects/javascript-logo.png",
        "/static/img/projects/kager-screencap.png",
        "/static/img/projects/kager-thumb.png",
        "/static/img/projects/minor-site-screencap-big.png",
        "/static/img/projects/minor-site-screencap-complete.png",
        "/static/img/projects/remind-diagram.jpg",
        "/portfolio",
        "/contact"
      ]);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return (
        resp ||
        fetch(event.request).then(function(response) {
          return caches.open(version).then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});

self.addEventListener("activate", function(event) {
  var cacheWhitelist = [version];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
