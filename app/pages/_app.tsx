import createCache from "@emotion/cache"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { BoxErrorFallback } from "app/core/components/box/BoxErrorFallback"
import "app/core/styles/global.css"
import { theme } from "app/core/theme/theme"
import { AppProps, ErrorBoundary, useQueryErrorResetBoundary } from "blitz"
import { getApps, initializeApp } from "firebase/app"
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth"
import { getPerformance } from "firebase/performance"
import "integrations/errors"
import { SnackbarProvider } from "notistack"
import React, { FunctionComponent, useEffect } from "react"

const clientSideEmotionCache = createCache({ key: "css" })

interface Props extends AppProps {
  emotionCache?: EmotionCache
}

const App: FunctionComponent<Props> = ({ Component, ...props }) => {
  const getLayout = Component.getLayout || ((page) => page)

  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  useEffect(() => {
    if (typeof window === "undefined" || getApps().length !== 0) return

    const app = initializeApp({
      apiKey: "AIzaSyBCojMAj-JQxc4-Ceu8nppJO_qx-gKYliU",
      authDomain: "fqcwljdj7qt9rphssvk3.firebaseapp.com",
      projectId: "fqcwljdj7qt9rphssvk3",
      storageBucket: "fqcwljdj7qt9rphssvk3.appspot.com",
      messagingSenderId: "511409109964",
      appId: "1:511409109964:web:1e5502c45cb09581223b69",
      measurementId: "G-HEP2VBXJZR",
    })

    getPerformance(app)

    setPersistence(getAuth(), inMemoryPersistence)
  }, [])

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
