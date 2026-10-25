import { renderToReadableStream } from "react-dom/server"
import NotFound from "@/components/not-found"
import stylesheet from "@/styles.css?url"

export async function notFoundResponse() {
  const body = await renderToReadableStream(
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, follow" />
        <title>ページが見つかりません | スイミー電子掲示板</title>
        <link rel="stylesheet" href={stylesheet} />
      </head>
      <body>
        <NotFound />
      </body>
    </html>,
  )
  return new Response(body, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
