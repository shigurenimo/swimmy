self.addEventListener("install", (event) => {
  console.log("install", event)
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.info("activate", event)
  self.registration
    .unregister()
    .then(function () {
      return self.clients.matchAll()
    })
    .then(function (clients) {
      clients.forEach((client) => client.navigate(client.url))
    })
})

self.addEventListener("fetch", (event) => {
  console.log("fetch", event)
})
