import { NoSsr } from "@mui/material"
import { usePageLayout } from "app/interface/core/hooks/usePageLayout"
import { useScreenView } from "app/interface/core/hooks/useScreenView"
import { LayoutHome } from "app/interface/core/layouts/LayoutHome"
import { BoxAsideFeedThread } from "app/interface/home/components/BoxAsideFeedThread"
import { BoxAsideFeedThreadFallback } from "app/interface/home/components/BoxAsideFeedThreadFallback"
import { BoxAsideHelloWorld } from "app/interface/home/components/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/interface/home/components/BoxFeedFallback"
import { BoxMainFeedPublic } from "app/interface/home/components/BoxMainFeedPublic"
import { BlitzPage, useParam, useRouter } from "blitz"
import { Suspense } from "react"

const PageHome: BlitzPage = () => {
  useScreenView("PageHome")

  const router = useRouter()

  const threadId = useParam("threadId", "string") ?? null

  const pageLayout = usePageLayout(threadId !== null)

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

  return (
    <NoSsr>
      {pageLayout.asideFallback && <BoxAsideHelloWorld />}
      {pageLayout.aside && threadId !== null && (
        <Suspense fallback={<BoxAsideFeedThreadFallback />}>
          <BoxAsideFeedThread threadId={threadId} onClose={onCloseThread} />
        </Suspense>
      )}
      {pageLayout.main && (
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

if (typeof window !== "undefined") {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister()
    })
  }
}

// Home.suppressFirstRenderFlicker = true

PageHome.getLayout = (page) => {
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PageHome
