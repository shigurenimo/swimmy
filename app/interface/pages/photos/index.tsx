import { usePageLayout } from "app/interface/core/hooks/usePageLayout"
import { useScreenView } from "app/interface/core/hooks/useScreenView"
import { LayoutHome } from "app/interface/core/layouts/LayoutHome"
import { BoxAsideFeedThread } from "app/interface/home/components/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "app/interface/home/components/BoxAsideFeedThreadFallback"
import { BoxAsideHelloWorld } from "app/interface/home/components/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/interface/home/components/BoxFeedFallback"
import { BoxMainFeedPhoto } from "app/interface/photos/components/BoxMainFeedPhoto"
import { BlitzPage, useParam, useRouter } from "blitz"
import { Suspense } from "react"

const PagePhotoList: BlitzPage = () => {
  useScreenView("PagePhotoList")

  const router = useRouter()

  const threadId = useParam("threadId", "string") ?? null

  const pageLayout = usePageLayout(threadId !== null)

  const onChangeThreadId = (threadId: string) => {
    router.push(`/photos/?threadId=${threadId}`, `/threads/${threadId}`, {
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
          <BoxMainFeedPhoto
            threadId={threadId}
            onChangeThreadId={onChangeThreadId}
          />
        </Suspense>
      )}
    </>
  )
}

PagePhotoList.getLayout = (page) => {
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PagePhotoList
