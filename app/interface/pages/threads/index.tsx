import { NoSsr } from "@mui/material"
import { usePageLayout } from "app/interface/core/hooks/usePageLayout"
import { useScreenView } from "app/interface/core/hooks/useScreenView"
import { LayoutHome } from "app/interface/core/layouts/LayoutHome"
import { BoxAsideHelloWorld } from "app/interface/home/components/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/interface/home/components/BoxFeedFallback"
import { BoxMainFeedThread } from "app/interface/threads/components/BoxMainFeedThread"
import { BlitzPage, useRouter } from "blitz"
import { Suspense } from "react"

const PageThreadList: BlitzPage = () => {
  useScreenView("PageThreadList")

  const router = useRouter()

  const pageLayout = usePageLayout(false)

  const onChangeThreadId = (threadId: string) => {
    router.push(`/threads/${threadId}`, undefined, { scroll: false })
  }

  return (
    <NoSsr>
      {pageLayout.asideFallback && <BoxAsideHelloWorld />}
      <Suspense fallback={<BoxFeedFallback />}>
        <BoxMainFeedThread
          threadId={null}
          onChangeThreadId={onChangeThreadId}
        />
      </Suspense>
    </NoSsr>
  )
}

PageThreadList.getLayout = (page) => {
  return <LayoutHome title={"スレッド"}>{page}</LayoutHome>
}

export default PageThreadList
