import { Suspense, type ReactNode } from "react"
import { Board } from "@/app/components/board"
import { LayoutHomeApp } from "@/app/components/layout-home-app"
import { BoxFeedFallback } from "@/interface/components/box/box-feed-fallback"

export default function BoardLayout(props: { children: ReactNode }) {
  return (
    <LayoutHomeApp>
      {props.children}
      <Suspense fallback={<BoxFeedFallback />}>
        <Board />
      </Suspense>
    </LayoutHomeApp>
  )
}
