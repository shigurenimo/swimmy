import { BlitzPage, useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { Suspense } from "react"
import { BoxAsideFeedThread } from "interface/components/box/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "interface/components/box/BoxAsideFeedThreadFallback"
import { BoxFeedFallback } from "interface/components/box/BoxFeedFallback"
import { BoxMainFeedThread } from "interface/components/box/BoxMainFeedThread"
import { usePageLayout } from "interface/hooks/usePageLayout"
import { LayoutHome } from "interface/layouts/LayoutHome"

const PageThread: BlitzPage = () => {
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
