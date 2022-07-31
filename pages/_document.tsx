import createCache from "@emotion/cache"
import createEmotionServer from "@emotion/server/create-instance"
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"
import React, { FC } from "react"

const createEmotionCache = () => {
  let insertionPoint

  if (typeof document !== "undefined") {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  return createCache({ key: "mui-style", insertionPoint })
}

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage

    const cache = createEmotionCache()

    const { extractCriticalToChunks } = createEmotionServer(cache)

    ctx.renderPage = () => {
      return originalRenderPage({
        enhanceApp(App: any) {
          const EnhanceApp: FC = (props) => {
            return <App emotionCache={cache} {...props} />
          }
          return EnhanceApp
        },
      })
    }

    const initialProps = await Document.getInitialProps(ctx)

    const emotionStyles = extractCriticalToChunks(initialProps.html)

    const emotionStyleTags = emotionStyles.styles.map((style) => {
      return (
        <style
          data-emotion={`${style.key} ${style.ids.join(" ")}`}
          key={style.key}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: style.css }}
        />
      )
    })

    return {
      ...initialProps,
      emotionStyleTags,
    }
  }

  render() {
    const fontURL =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&display=swap"

    return (
      <Html lang={"ja"}>
        <Head>
          <link rel={"preconnect"} href={"https://fonts.googleapis.com"} />
          <link
            rel={"preconnect"}
            href={"https://fonts.gstatic.com"}
            crossOrigin={""}
          />
          <link href={fontURL} rel={"stylesheet"} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
