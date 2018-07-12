self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open("v1").then(function(cache) {
      return cache.addAll([
        "/",
        "/portfolio",
        "/projects/design/exclusive-design",
        "/static/css/fonts.css",
        "/static/js/app.js",
        "/static/js/search.js",
        "/static/img/baskager.jpg",
        "/static/img/minor-site-screencap-big3.png"
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
          return caches.open("v1").then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});
