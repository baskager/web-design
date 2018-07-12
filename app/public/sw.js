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
