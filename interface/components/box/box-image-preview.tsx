import { X } from "lucide-react"
import type { FC } from "react"
import { Button } from "@/components/ui/button"
import { BoxImage } from "@/interface/components/box/box-image"

type Props = {
  fileId: string
  onDelete(): void
}

export const BoxImagePreview: FC<Props> = (props) => {
  return (
    <div className="relative">
      <BoxImage fileId={props.fileId} />
      <div className="absolute top-2 right-2">
        <Button
          size="icon"
          variant="secondary"
          aria-label="画像を削除"
          type="button"
          onClick={props.onDelete}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
