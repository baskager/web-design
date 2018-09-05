// Feature detection for the ServiceWorker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function(reg) {
      // registration worked
      console.log(
        "ServiceWorker registration succeeded. Scope is " + reg.scope
      );
    })
    .catch(function(error) {
      // registration failed
      console.log("ServiceWorker registration failed with " + error);
    });
}
