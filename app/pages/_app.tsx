import createCache from "@emotion/cache"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { init } from "@sentry/browser"
import { Integrations } from "@sentry/tracing"
import { BoxErrorFallback } from "app/core/components/box/BoxErrorFallback"
import "app/core/styles/global.css"
import { theme } from "app/core/theme/theme"
import { AppProps, ErrorBoundary, useQueryErrorResetBoundary } from "blitz"
import { getAnalytics, setAnalyticsCollectionEnabled } from "firebase/analytics"
import { getApps, initializeApp } from "firebase/app"
import {
  connectAuthEmulator,
  getAuth,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectStorageEmulator, getStorage } from "firebase/storage"
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

if (typeof window !== "undefined") {
  init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
    tracesSampleRate: 1.0,
    release: `${process.env.NEXT_PUBLIC_SENTRY_RELEASE}`,
  })
}

if (getApps().length === 0) {
  initializeApp({
    apiKey: "AIzaSyBCojMAj-JQxc4-Ceu8nppJO_qx-gKYliU",
    authDomain: "fqcwljdj7qt9rphssvk3.firebaseapp.com",
    projectId: "fqcwljdj7qt9rphssvk3",
    storageBucket: "fqcwljdj7qt9rphssvk3.appspot.com",
    messagingSenderId: "511409109964",
    appId: "1:511409109964:web:1e5502c45cb09581223b69",
    measurementId: "G-HEP2VBXJZR",
  })

  if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(getAuth(), "http://localhost:9099")
    connectFirestoreEmulator(getFirestore(), "localhost", 8080)
    connectStorageEmulator(getStorage(), "localhost", 9199)
  }

  if (typeof window !== "undefined") {
    setPersistence(getAuth(), inMemoryPersistence)
  }

  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    setAnalyticsCollectionEnabled(getAnalytics(), false)
  }
}

export default App
