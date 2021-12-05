import { Theme, useMediaQuery } from "@mui/material"
import { LayoutHome } from "app/core/layouts/LayoutHome"
import { BoxAsideFeedThread } from "app/home/components/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "app/home/components/BoxAsideFeedThreadFallback"
import { BoxFeedFallback } from "app/home/components/BoxFeedFallback"
import { BoxMainFeedThread } from "app/threads/components/BoxMainFeedThread"
import { BlitzPage, useParam, useRouter } from "blitz"
import React, { Suspense } from "react"

const PageThread: BlitzPage = () => {
  const router = useRouter()

  const threadId = useParam("threadId", "string") ?? null

  const isTwoColumn = useMediaQuery<Theme>(
    (theme) => theme.breakpoints.up("md"),
    { noSsr: true }
  )

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

  const forThread = threadId !== null

  return (
    <>
      {forThread && (
        <Suspense fallback={<BoxAsideFeedThreadFallback />}>
          <BoxAsideFeedThread threadId={threadId} onClose={onCloseThread} />
        </Suspense>
      )}
      {isTwoColumn && (
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
