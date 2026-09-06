self.addEventListener("install", (event) => {
  console.log("install", event)
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.info("activate", event)
  self.registration
    .unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => client.navigate(client.url))
    })
})

self.addEventListener("fetch", (event) => {
  console.log("fetch", event)
})
