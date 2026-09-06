import handler from "vinext/server/fetch-handler"

export default {
  fetch(request: Request, env: Env, context: ExecutionContext) {
    if (env.READ_ONLY === "true" && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      return Response.json(
        { message: "データ移行中のため、一時的に書き込みを停止しています" },
        { status: 503, headers: { "Retry-After": "3600" } },
      )
    }
    return handler.fetch(request, env, context)
  },
}
