import { usePageLayout } from "app/interface/core/hooks/usePageLayout"
import { useScreenView } from "app/interface/core/hooks/useScreenView"
import { LayoutHome } from "app/interface/core/layouts/LayoutHome"
import { BoxAsideFeedThread } from "app/interface/home/components/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "app/interface/home/components/BoxAsideFeedThreadFallback"
import { BoxFeedFallback } from "app/interface/home/components/BoxFeedFallback"
import { BoxMainFeedThread } from "app/interface/threads/components/BoxMainFeedThread"
import { BlitzPage, useParam, useRouter } from "blitz"
import { Suspense } from "react"

const PageThread: BlitzPage = () => {
  useScreenView("PageThread")

  const router = useRouter()

  const threadId = useParam("threadId", "string") ?? null

  const pageLayout = usePageLayout(threadId !== null)

  const onCloseThread = () => {
    router.push("/threads", undefined, {
      shallow: false,
      scroll: false,
    })
  }

  const onChangeThreadId = (threadId: string) => {
    router.push(`/threads/${threadId}`, undefined, {
      shallow: false,
      scroll: false,
    })
  }

  return (
    <>
      {pageLayout.aside && threadId !== null && (
        <Suspense fallback={<BoxAsideFeedThreadFallback />}>
          <BoxAsideFeedThread threadId={threadId} onClose={onCloseThread} />
        </Suspense>
      )}
      {pageLayout.main && (
        <Suspense fallback={<BoxFeedFallback />}>
          <BoxMainFeedThread
            threadId={threadId}
            onChangeThreadId={onChangeThreadId}
          />
        </Suspense>
      )}
    </>
  )
}

PageThread.getLayout = (page) => {
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PageThread
