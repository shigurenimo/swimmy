import { NoSsr, Theme, useMediaQuery } from "@mui/material"
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

  const isTwoColumn = useMediaQuery<Theme>(
    (theme) => theme.breakpoints.up("md"),
    { noSsr: true }
  )

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

  const forHello = isTwoColumn && threadId === null

  const forThread = threadId !== null

  const forFeed = isTwoColumn || threadId === null

  return (
    <NoSsr>
      {forHello && <BoxAsideHelloWorld />}
      {forThread && (
        <Suspense fallback={<BoxAsideFeedThreadFallback />}>
          <BoxAsideFeedThread threadId={threadId} onClose={onCloseThread} />
        </Suspense>
      )}
      {forFeed && (
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

// Home.suppressFirstRenderFlicker = true

PageHome.getLayout = (page) => {
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PageHome
