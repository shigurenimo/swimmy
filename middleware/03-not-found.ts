import { defineMiddleware } from "void"
import { notFoundResponse } from "@/service/not-found-response"

export default defineMiddleware(async (c, next) => {
  await next()
  if (
    c.res.status === 404 &&
    !c.req.path.startsWith("/api/") &&
    c.req.header("Accept")?.includes("text/html")
  ) {
    c.res = await notFoundResponse()
  }
})
