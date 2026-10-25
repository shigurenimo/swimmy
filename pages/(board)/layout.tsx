import { useShared } from "@void/react"
import type { ReactNode } from "react"
import { Board } from "@/components/board"
import { LayoutHomeApp } from "@/components/layout-home-app"
import { HydrateBoard } from "@/components/query-provider"

export default function BoardLayout({ children }: { children: ReactNode }) {
  const { board } = useShared()
  if (!board) return children
  return (
    <LayoutHomeApp>
      <HydrateBoard state={board.state}>
        {children}
        <Board />
      </HydrateBoard>
    </LayoutHomeApp>
  )
}
