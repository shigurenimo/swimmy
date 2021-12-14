import { LoadingButton } from "@mui/lab"
import React, { FunctionComponent } from "react"

type Props = {
  isFetching: boolean
  isFetchingNextPage: boolean
  hasNextPage?: boolean
  onClick(): void
}

export const ButtonFetchMore: FunctionComponent<Props> = (props) => {
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
