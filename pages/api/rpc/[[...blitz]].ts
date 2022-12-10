import { rpcHandler } from "@blitzjs/rpc"
import { captureException } from "@sentry/node"
import { api } from "interface/blitz-server"

export default api(
  rpcHandler({
    onError(error) {
      captureException(error)
      console.error(error)
    },
  })
)
