import { Theme, useMediaQuery } from "@mui/material"
import { LayoutHome } from "app/core/layouts/LayoutHome"
import { BoxAsideFeedThread } from "app/home/components/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "app/home/components/BoxAsideFeedThreadFallback"
import { BoxAsideHelloWorld } from "app/home/components/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/home/components/BoxFeedFallback"
import { BoxMainFeedPhoto } from "app/photos/components/BoxMainFeedPhoto"
import { BlitzPage, useParam, useRouter } from "blitz"
import React, { Suspense } from "react"

const PagePhotos: BlitzPage = () => {
  const router = useRouter()

  const threadId = useParam("threadId", "string") ?? null

  const isTwoColumn = useMediaQuery<Theme>(
    (theme) => theme.breakpoints.up("md"),
    { noSsr: true }
  )

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

  const forHello = isTwoColumn && threadId === null

  const forThread = threadId !== null

  const forFeed = isTwoColumn || threadId === null

  return (
    <>
      {forHello && <BoxAsideHelloWorld />}
      {forThread && (
        <Suspense fallback={<BoxAsideFeedThreadFallback />}>
          <BoxAsideFeedThread threadId={threadId} onClose={onCloseThread} />
        </Suspense>
      )}
      {forFeed && (
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

PagePhotos.getLayout = (page) => {
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PagePhotos
