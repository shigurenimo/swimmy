import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import packageJSON from "./package.json"

const config: BlitzConfig = {
  log: { level: "error" },
  middleware: [
    sessionMiddleware({
      cookiePrefix: "swimmy",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  env: {
    SENTRY_RELEASE: `knocker@${packageJSON.version}`,
  },
}

module.exports = config
