import type { FC } from "react"
import { BoxImage } from "@/interface/components/box/box-image"
import { getDateText } from "@/interface/utils/get-date-text"

type Props = {
  createdAt: number
  index: number
  text: string | null
  isDeleted: boolean
  fileIds: string[]
}

export const BoxCardResponse: FC<Props> = (props) => {
  const dateText = getDateText(new Date(props.createdAt * 1000))

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <span className="font-bold text-base">{props.index}</span>
        <time
          dateTime={new Date(props.createdAt * 1000).toISOString()}
          suppressHydrationWarning
          className="text-base tracking-wide text-muted-foreground"
        >
          {dateText}
        </time>
      </div>
      {props.isDeleted ? (
        <p>この投稿は削除されました。</p>
      ) : (
        props.text && <p className="whitespace-pre-wrap font-bold">{props.text}</p>
      )}
      {!props.isDeleted && props.fileIds.map((fileId) => <BoxImage key={fileId} fileId={fileId} />)}
    </div>
  )
}
