import { Chip } from "@mui/material"
import { useSnackbar } from "notistack"
import React, { FunctionComponent, useState } from "react"

type Props = {
  text: string
  count: number
  secretCount: number
  onClick(): void
}

export const ChipSecretReaction: FunctionComponent<Props> = (props) => {
  const [count, setCount] = useState(props.count + props.secretCount)

  const { enqueueSnackbar } = useSnackbar()

  const [errorCount, setErrorCount] = useState(0)

  const isActive = props.secretCount < 10

  const onClickChip = () => {
    if (9 < props.secretCount) {
      setErrorCount(errorCount + 1)
      enqueueSnackbar("これ以上はカウント出来ません", {
        variant: "info",
      })
      return null
    }
    setCount(count + 1)
    props.onClick()
  }

  return (
    <Chip
      sx={{ borderRadius: 1 }}
      label={`${props.text} ${count}`}
      size={"small"}
      variant={"outlined"}
      disabled={2 < errorCount}
      color={isActive ? "primary" : "default"}
      onClick={(event) => {
        event.stopPropagation()
        onClickChip()
      }}
    />
  )
}
