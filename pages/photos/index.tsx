import { BlitzPage, useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { Suspense } from "react"
import { BoxAsideFeedThread } from "app/interface/components/box/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "app/interface/components/box/BoxAsideFeedThreadFallback"
import { BoxAsideHelloWorld } from "app/interface/components/box/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/interface/components/box/BoxFeedFallback"
import { BoxMainFeedPhoto } from "app/interface/components/box/BoxMainFeedPhoto"
import { usePageLayout } from "app/interface/hooks/usePageLayout"
import { LayoutHome } from "app/interface/layouts/LayoutHome"

const PagePhotoList: BlitzPage = () => {
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
