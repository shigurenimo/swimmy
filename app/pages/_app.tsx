import createCache from "@emotion/cache"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { RootErrorFallback } from "app/core/components/app/RootErrorFallback"
import { theme } from "app/core/theme/theme"
import { AppProps, ErrorBoundary, useQueryErrorResetBoundary } from "blitz"
import React, { FunctionComponent } from "react"

const clientSideEmotionCache = createCache({ key: "css" })

interface Props extends AppProps {
  emotionCache?: EmotionCache
}

const App: FunctionComponent<Props> = ({ Component, ...props }) => {
  const getLayout = Component.getLayout || ((page) => page)

  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={queryErrorResetBoundary.reset}
    >
      <CacheProvider value={props.emotionCache || clientSideEmotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {getLayout(<Component {...props.pageProps} />)}
        </ThemeProvider>
      </CacheProvider>
    </ErrorBoundary>
  )
}

export default App
