self.addEventListener("install", (event) => {
  console.log("install", event)
})

self.addEventListener("activate", (event) => {
  console.info("activate", event)
})

self.addEventListener("fetch", (event) => {
  console.log("fetch", event)
})
