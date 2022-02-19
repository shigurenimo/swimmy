import createCache from "@emotion/cache"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { BoxErrorFallback } from "app/core/components/box/BoxErrorFallback"
import { useFirebase } from "app/core/hooks/useFirebase"
import "app/core/styles/global.css"
import { theme } from "app/core/theme/theme"
import { AppProps, ErrorBoundary, useQueryErrorResetBoundary } from "blitz"
import "integrations/errors"
import { SnackbarProvider } from "notistack"
import React, { FunctionComponent } from "react"

const clientSideEmotionCache = createCache({ key: "css" })

interface Props extends AppProps {
  emotionCache?: EmotionCache
}

const App: FunctionComponent<Props> = ({ Component, ...props }) => {
  const getLayout = Component.getLayout || ((page) => page)

  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  useFirebase()

  return (
    <ErrorBoundary
      FallbackComponent={BoxErrorFallback}
      onReset={queryErrorResetBoundary.reset}
    >
      <CacheProvider value={props.emotionCache || clientSideEmotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            {getLayout(<Component {...props.pageProps} />)}
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </ErrorBoundary>
  )
}

export default App
