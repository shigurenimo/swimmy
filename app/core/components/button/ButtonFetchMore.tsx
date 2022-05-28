import { LoadingButton } from "@mui/lab"
import { FC } from "react"

type Props = {
  isFetching: boolean
  isFetchingNextPage: boolean
  hasNextPage?: boolean
  onClick(): void
}

export const ButtonFetchMore: FC<Props> = (props) => {
  return (
    <LoadingButton
      variant={"outlined"}
      disabled={props.isFetching || !props.hasNextPage}
      loading={props.isFetchingNextPage}
      fullWidth={true}
      onClick={props.onClick}
    >
      {props.hasNextPage ? "もっと見る" : "これ以上はダメ"}
    </LoadingButton>
  )
}
