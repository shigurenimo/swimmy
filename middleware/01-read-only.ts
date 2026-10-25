import { defineMiddleware } from "void"

export default defineMiddleware(async (c, next) => {
  if (c.env.READ_ONLY === "true" && !["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
    return c.json({ message: "データ移行中のため、一時的に書き込みを停止しています" }, 503, {
      "Retry-After": "3600",
    })
  }
  await next()
})
