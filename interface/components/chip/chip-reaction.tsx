import type { FC } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  text: string
  count: number
  isActive: boolean
  onClick(): void
  secretCount: number
}

export const ChipReaction: FC<Props> = (props) => {
  return (
    <Button
      variant={props.isActive ? "default" : "secondary"}
      size="sm"
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        props.onClick()
      }}
      className="h-8 gap-2 px-2 text-xs"
    >
      <span>{props.text}</span>
      <span className="text-xs">{props.count + props.secretCount}</span>
    </Button>
  )
}
