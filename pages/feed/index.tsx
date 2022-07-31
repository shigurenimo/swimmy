import { usePageLayout } from "app/interface/hooks/usePageLayout"
import { useScreenView } from "app/interface/hooks/useScreenView"
import { LayoutHome } from "app/interface/layouts/LayoutHome"
import { BoxMainFeedPersonal } from "app/interface/components/box/BoxMainFeedPersonal"
import { BoxAsideFeedThread } from "app/interface/components/box/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "app/interface/components/box/BoxAsideFeedThreadFallback"
import { BoxAsideHelloWorld } from "app/interface/components/box/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/interface/components/box/BoxFeedFallback"
import { BlitzPage, useParam } from "@blitzjs/next"
import { Suspense } from "react"
import { useRouter } from "next/router"

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
