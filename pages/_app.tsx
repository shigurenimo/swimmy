import { AppProps, ErrorBoundary } from "@blitzjs/next"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { Nocker, NockerProvider } from "@nocker/mui"
import { init } from "@sentry/browser"
import { Integrations } from "@sentry/tracing"
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
import Head from "next/head"
import { SnackbarProvider } from "notistack"
import { FC } from "react"
import { withBlitz } from "app/blitz-client"
import "app/interface/theme/global.css"
import { BoxErrorFallback } from "app/interface/components/box/BoxErrorFallback"
import { theme } from "app/interface/theme/theme"
import { createEmotionCache } from "app/interface/utils/createEmotionCache"
import { unregister } from "app/interface/utils/serviceWorker"
import "integrations/errors"

const clientSideEmotionCache = createEmotionCache()

type Props = AppProps & {
  emotionCache?: EmotionCache
}

const App: FC<Props> = ({ Component, ...props }) => {
  const getLayout = Component.getLayout || ((page) => page)

  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  const nocker = new Nocker({
    projectId: "jX1A2O0pA1wR_6eqh_SGn",
    environment:
      process.env.NODE_ENV === "development" ? "DEVELOPMENT" : "PRODUCTION",
  })

  return (
    <>
      <Head>
        {/** https://github.com/vercel/next.js/discussions/13387#discussioncomment-2387429 */}
        <style>{"nextjs-portal { display: none; }"}</style>
      </Head>
      <ErrorBoundary
        FallbackComponent={BoxErrorFallback}
        onReset={queryErrorResetBoundary.reset}
      >
        <CacheProvider value={props.emotionCache || clientSideEmotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              <NockerProvider client={nocker}>
                {getLayout(<Component {...props.pageProps} />)}
              </NockerProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </CacheProvider>
      </ErrorBoundary>
    </>
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

if (typeof window !== "undefined") {
  unregister()
}

export default withBlitz(App)
