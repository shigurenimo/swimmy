import * as Sentry from "@sentry/node"
import { InternalError } from "infrastructure/errors"
import type { Context } from "types"

type Resolver<T, U> = (t: T, ctx: Context) => PromiseLike<U>

let isInitialized = false

export const withSentry = <T, U>(resolver: Resolver<T, U>, name: string) => {
  return async (props: T, ctx: Context) => {
    try {
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

      Sentry.setUser({ id: ctx.session?.userId ?? undefined })

      Sentry.setContext("props", props as Record<string, unknown>)

      return await Sentry.startSpan({ op: "function", name }, async () => {
        return await resolver(props, ctx)
      })
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }

      throw new InternalError()
    }
  }
}
