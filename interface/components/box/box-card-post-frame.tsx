import type { FC, ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  isActive?: boolean
  isClickable?: boolean
}

export const BoxCardPostFrame: FC<Props> = (props) => {
  return (
    <Card
      className={cn(
        "flex w-full flex-col gap-4 rounded-md border p-4 transition-colors",
        props.isActive ? "bg-card" : "bg-transparent",
        props.isClickable && "hover:border-foreground/50",
      )}
    >
      {props.children}
    </Card>
  )
}
