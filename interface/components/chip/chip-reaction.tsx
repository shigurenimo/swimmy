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
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        props.onClick()
      }}
    >
      <span>{props.text}</span>
      <span>{props.count + props.secretCount}</span>
    </Button>
  )
}
