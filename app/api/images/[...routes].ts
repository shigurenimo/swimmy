import { withSentryForApi } from "app/core/utils/withSentryForApi"
import { BlitzApiHandler } from "blitz"
import { ReadImageQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"

const handler: BlitzApiHandler = async (req, resp) => {
  try {
    console.log(req.query)

    if (!Array.isArray(req.query.routes)) {
      return resp.status(500).end()
    }

    if (typeof req.query.w !== "string" || typeof req.query.q !== "string") {
      return resp.status(500).end()
    }

    const [queryId] = req.query.routes

    if (typeof queryId !== "string") {
      return resp.status(500).end()
    }

    const fileId = new Id(queryId)

    const readFileQuery = container.resolve(ReadImageQuery)

    const width = parseInt(req.query.w)

    const quality = parseInt(req.query.q)

    const file = await readFileQuery.execute({ fileId, width, quality })

    // resp.writeHead(200, { "Content-Type": "image/jpeg" })

    // resp.setHeader("Cache-control", "public, max-age=86400")

    resp.end(file)
  } catch (error) {
    console.log(error)
    resp.end()
  }
}

export default withSentryForApi(handler, "[...routes]")
