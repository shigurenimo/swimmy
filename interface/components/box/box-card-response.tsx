import type { FC } from "react"
import { getDateText } from "@/interface/utils/get-date-text"

type Props = {
  createdAt: number
  index: number
  text: string | null
}

export const BoxCardResponse: FC<Props> = (props) => {
  const dateText = getDateText(new Date(props.createdAt * 1000))

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <span className="font-bold text-sm">{props.index}</span>
        <time
          dateTime={new Date(props.createdAt * 1000).toISOString()}
          suppressHydrationWarning
          className="text-xs tracking-wide text-muted-foreground"
        >
          {dateText}
        </time>
      </div>
      {props.text && <p className="whitespace-pre-wrap font-bold">{props.text}</p>}
    </div>
  )
}
