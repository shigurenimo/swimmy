import { BlitzPage } from "@blitzjs/next"
import { NoSsr } from "@mui/material"
import { useRouter } from "next/router"
import { Suspense } from "react"
import { BoxAsideHelloWorld } from "app/interface/components/box/BoxAsideHelloWorld"
import { BoxFeedFallback } from "app/interface/components/box/BoxFeedFallback"
import { BoxMainFeedThread } from "app/interface/components/box/BoxMainFeedThread"
import { usePageLayout } from "app/interface/hooks/usePageLayout"
import { useScreenView } from "app/interface/hooks/useScreenView"
import { LayoutHome } from "app/interface/layouts/LayoutHome"

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
