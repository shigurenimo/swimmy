import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import packageJSON from "./package.json"

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "swimmy",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  log: { level: "info" },
  env: {
    SENTRY_RELEASE: `swimmy@${packageJSON.version}`,
  },
}

module.exports = config
