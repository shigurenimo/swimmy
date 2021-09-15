import createCache from "@emotion/cache"
import createEmotionServer from "@emotion/server/create-instance"
import {
  BlitzScript,
  Document,
  DocumentContext,
  DocumentHead,
  Html,
  Main,
} from "blitz"
import React from "react"

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage

    const cache = createCache({ key: "css" })

    const { extractCriticalToChunks } = createEmotionServer(cache)

    ctx.renderPage = () => {
      return originalRenderPage({
        enhanceApp(App: any) {
          return (props) => {
            return <App emotionCache={cache} {...props} />
          }
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
      styles: [
        ...React.Children.toArray(initialProps.styles),
        ...emotionStyleTags,
      ],
    }
  }

  render() {
    return (
      <Html lang={"ja"}>
        <DocumentHead />
        <body>
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
