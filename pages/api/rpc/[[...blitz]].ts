import { rpcHandler } from "@blitzjs/rpc"
import { captureException } from "@sentry/node"
import { api } from "app/blitz-server"

export default api(
  rpcHandler({
    onError(error) {
      captureException(error)
      console.error(error)
    },
  })
)
