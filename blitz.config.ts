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
    SENTRY_RELEASE: `swimmy@${packageJSON.version}`,
  },
  pwa: { disable: true },
}

const withPWA = require("next-pwa")

module.exports = withPWA(config)
