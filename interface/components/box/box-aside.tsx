import { X } from "lucide-react"
import type { FC, ReactNode } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  children: ReactNode
  title: string
  onClose?(): void
}

export const BoxAside: FC<Props> = (props) => {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-16 flex shrink-0 items-center justify-between gap-4 bg-background p-4">
        <h2 className="font-medium">{props.title}</h2>
        {props.onClose && (
          <Button
            variant="secondary"
            size="icon"
            aria-label="スレッドを閉じる"
            onClick={props.onClose}
          >
            <X className="size-4" />
          </Button>
        )}
      </header>
      <div className="flex flex-col gap-4 px-4 pb-4">{props.children}</div>
    </div>
  )
}
