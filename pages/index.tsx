import { BlitzPage, useParam } from "@blitzjs/next"
import { NoSsr } from "@mui/material"
import { useRouter } from "next/router"
import { Suspense } from "react"
import { BoxAsideFeedThread } from "interface/components/box/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "interface/components/box/BoxAsideFeedThreadFallback"
import { BoxAsideHelloWorld } from "interface/components/box/BoxAsideHelloWorld"
import { BoxFeedFallback } from "interface/components/box/BoxFeedFallback"
import { BoxMainFeedPublic } from "interface/components/box/BoxMainFeedPublic"
import { usePageLayout } from "interface/hooks/usePageLayout"
import { LayoutHome } from "interface/layouts/LayoutHome"

const PageHome: BlitzPage = () => {
  const router = useRouter()

  const threadId = useParam("threadId", "string") ?? null

  const pageLayout = usePageLayout(threadId !== null)

  const onChangeThreadId = (threadId: string) => {
    router.push(`/?threadId=${threadId}`, `/threads/${threadId}`, {
      scroll: false,
    })
  }

  const onCloseThread = () => {
    router.push("/", undefined, {
      shallow: false,
      scroll: false,
    })
  }

  return (
    <NoSsr>
      {pageLayout.asideFallback && <BoxAsideHelloWorld />}
      {pageLayout.aside && threadId !== null && (
        <Suspense fallback={<BoxAsideFeedThreadFallback />}>
          <BoxAsideFeedThread threadId={threadId} onClose={onCloseThread} />
        </Suspense>
      )}
      {pageLayout.main && (
        <Suspense fallback={<BoxFeedFallback />}>
          <BoxMainFeedPublic
            threadId={threadId}
            onChangeThreadId={onChangeThreadId}
          />
        </Suspense>
      )}
    </NoSsr>
  )
}

if (typeof window !== "undefined") {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister()
    })
  }
}

// Home.suppressFirstRenderFlicker = true

PageHome.getLayout = (page) => {
  return <LayoutHome>{page}</LayoutHome>
}

export default PageHome
