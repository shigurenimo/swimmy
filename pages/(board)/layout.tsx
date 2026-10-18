import { useShared } from "@void/react"
import type { ReactNode } from "react"
import { Board } from "@/app/components/board"
import { LayoutHomeApp } from "@/app/components/layout-home-app"
import { HydrateBoard } from "@/app/providers"

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
