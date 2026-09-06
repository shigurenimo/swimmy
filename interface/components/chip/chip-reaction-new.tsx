import { Plus } from "lucide-react"
import type { FC } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  label: string
  onClick(): void
}

export const ChipReactionNew: FC<Props> = (props) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      type="button"
      aria-label={props.label}
      title={props.label}
      onClick={(event) => {
        event.stopPropagation()
        props.onClick()
      }}
      className="size-8 rounded-full p-2"
    >
      <Plus className="h-4 w-4" />
    </Button>
  )
}
