const { withBlitz } = require("@blitzjs/next")
const packageJSON = require("./package.json")

module.exports = withBlitz({
  env: {
    NEXT_PUBLIC_SENTRY_RELEASE: `swimmy@${packageJSON.version}`,
  },
})
