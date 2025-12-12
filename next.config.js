const packageJSON = require("./package.json")

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  env: {
    NEXT_PUBLIC_SENTRY_RELEASE: `swimmy@${packageJSON.version}`,
  },
}

module.exports = nextConfig
