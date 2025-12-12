import { NoSsr } from "@mui/material"
import { useRouter } from "next/router"
import type { ReactElement } from "react"
import { Suspense } from "react"
import { BoxAsideHelloWorld } from "interface/components/box/BoxAsideHelloWorld"
import { BoxFeedFallback } from "interface/components/box/BoxFeedFallback"
import { BoxMainFeedThread } from "interface/components/box/BoxMainFeedThread"
import { usePageLayout } from "interface/hooks/usePageLayout"
import { LayoutHome } from "interface/layouts/LayoutHome"

const PageThreadList = () => {
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

PageThreadList.getLayout = (page: ReactElement) => {
  return <LayoutHome title={"スレッド"}>{page}</LayoutHome>
}

export default PageThreadList
