import { NoSsr } from "@mui/material"
import { usePageLayout } from "app/core/hooks/usePageLayout"
import { LayoutHome } from "app/core/layouts/LayoutHome"
import { BoxAsideFeedThread } from "app/home/components/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "app/home/components/BoxAsideFeedThreadFallback"
import { BoxAsideHelloWorld } from "app/home/components/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/home/components/BoxFeedFallback"
import { BoxMainFeedPublic } from "app/home/components/BoxMainFeedPublic"
import { BlitzPage, useParam, useRouter } from "blitz"
import React, { Suspense } from "react"

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
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PageHome
