import { NoSsr, Theme, useMediaQuery } from "@mui/material"
import { LayoutHome } from "app/core/layouts/LayoutHome"
import { BoxAsideHelloWorld } from "app/home/components/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/home/components/BoxFeedFallback"
import { BoxMainFeedThread } from "app/threads/components/BoxMainFeedThread"
import { BlitzPage, useRouter } from "blitz"
import React, { Suspense } from "react"

const PageThreads: BlitzPage = () => {
  const router = useRouter()

  const isTwoColumn = useMediaQuery<Theme>(
    (theme) => theme.breakpoints.up("md"),
    { noSsr: true }
  )

  const onChangeThreadId = (threadId: string) => {
    router.push(`/threads/${threadId}`, undefined, { scroll: false })
  }

  return (
    <NoSsr>
      {isTwoColumn && <BoxAsideHelloWorld />}
      <Suspense fallback={<BoxFeedFallback />}>
        <BoxMainFeedThread
          threadId={null}
          onChangeThreadId={onChangeThreadId}
        />
      </Suspense>
    </NoSsr>
  )
}

PageThreads.getLayout = (page) => {
  return <LayoutHome title={"スレッド"}>{page}</LayoutHome>
}

export default PageThreads
