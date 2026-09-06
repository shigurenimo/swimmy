import type { FC, ReactNode } from "react"
import { cn } from "@/lib/utils"

type Props = {
  children?: ReactNode
  className?: string
}

export const BoxMain: FC<Props> = (props) => {
  return <div className={cn("w-full min-w-0 p-4", props.className)}>{props.children}</div>
}
