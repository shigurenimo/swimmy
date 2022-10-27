import { BlitzPage, useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { Suspense } from "react"
import { BoxAsideFeedThread } from "interface/components/box/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "interface/components/box/BoxAsideFeedThreadFallback"
import { BoxAsideHelloWorld } from "interface/components/box/BoxAsideHelloWorld"
import { BoxFeedFallback } from "interface/components/box/BoxFeedFallback"
import { BoxMainFeedPersonal } from "interface/components/box/BoxMainFeedPersonal"
import { usePageLayout } from "interface/hooks/usePageLayout"
import { LayoutHome } from "interface/layouts/LayoutHome"

const PageFeed: BlitzPage = () => {
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
