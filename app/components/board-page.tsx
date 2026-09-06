import { Suspense } from "react"
import { Board } from "@/app/components/board"
import { LayoutHomeApp } from "@/app/components/layout-home-app"
import { BoxFeedFallback } from "@/interface/components/box/box-feed-fallback"

type Props = {
  initialTab: "home" | "threads"
  threadId?: string
}

export function BoardPage(props: Props) {
  return (
    <LayoutHomeApp>
      <Suspense fallback={<BoxFeedFallback />}>
        <Board initialTab={props.initialTab} threadId={props.threadId ?? null} />
      </Suspense>
    </LayoutHomeApp>
  )
}
