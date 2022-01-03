import { usePageLayout } from "app/core/hooks/usePageLayout"
import { useScreenView } from "app/core/hooks/useScreenView"
import { LayoutHome } from "app/core/layouts/LayoutHome"
import { BoxMainFeedPersonal } from "app/feed/components/BoxMainFeedPersonal"
import { BoxAsideFeedThread } from "app/home/components/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "app/home/components/BoxAsideFeedThreadFallback"
import { BoxAsideHelloWorld } from "app/home/components/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/home/components/BoxFeedFallback"
import { BlitzPage, useParam, useRouter } from "blitz"
import React, { Suspense } from "react"

const PageFeed: BlitzPage = () => {
  useScreenView("PageFeed")

  const router = useRouter()

  const threadId = useParam("threadId", "string") ?? null

  const pageLayout = usePageLayout(threadId !== null)

  const onChangeThreadId = (threadId: string) => {
    router.push(`/feed/?threadId=${threadId}`, `/threads/${threadId}`, {
      shallow: false,
      scroll: false,
    })
  }

  const onCloseThread = () => {
    router.push("/feed", undefined, {
      shallow: false,
      scroll: false,
    })
  }

  return (
    <>
      {pageLayout.asideFallback && <BoxAsideHelloWorld />}
      {pageLayout.aside && threadId !== null && (
        <Suspense fallback={<BoxAsideFeedThreadFallback />}>
          <BoxAsideFeedThread threadId={threadId} onClose={onCloseThread} />
        </Suspense>
      )}
      {pageLayout.main && (
        <Suspense fallback={<BoxFeedFallback />}>
          <BoxMainFeedPersonal
            threadId={null}
            onChangeThreadId={onChangeThreadId}
          />
        </Suspense>
      )}
    </>
  )
}

// Home.suppressFirstRenderFlicker = true

PageFeed.getLayout = (page) => {
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PageFeed
