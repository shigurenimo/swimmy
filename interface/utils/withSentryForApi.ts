import * as Sentry from "@sentry/node"
import { NextApiHandler } from "next"

let isInitialized = false

export const withSentryForApi = (handler: NextApiHandler, name: string) => {
  const internalHandler: NextApiHandler = async (req, resp) => {
    if (!isInitialized) {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 1.0,
        attachStacktrace: true,
        normalizeDepth: 5,
        environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
        release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
        debug: false,
        beforeSend(event) {
          if (process.env.NODE_ENV !== "production") {
            for (const exception of event.exception?.values ?? []) {
              console.error(exception.value)
            }
            return null
          }
          return event
        },
      })
      isInitialized = true
    }

    Sentry.setContext("req.query", req.query)

    Sentry.setContext("req.body", req.body as Record<string, unknown>)

    return await Sentry.startSpan({ op: "function", name }, async () => {
      return await handler(req, resp)
    })
  }

  return internalHandler
}
