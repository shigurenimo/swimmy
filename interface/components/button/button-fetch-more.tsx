import type { FC } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  isFetching: boolean
  isFetchingNextPage: boolean
  hasNextPage?: boolean
  onClick(): void
}

export const ButtonFetchMore: FC<Props> = (props) => {
  return (
    <Button
      variant="secondary"
      disabled={props.isFetching || !props.hasNextPage}
      onClick={props.onClick}
    >
      {props.isFetchingNextPage
        ? "読み込み中..."
        : props.hasNextPage
          ? "もっと見る"
          : "これ以上はダメ"}
    </Button>
  )
}
