import { Chip } from "@mui/material"
import React, { FunctionComponent, useState } from "react"

type Props = {
  text: string
  count: number
  secretCount: number
  isActive: boolean
  onClick(): void
}

export const ChipReaction: FunctionComponent<Props> = (props) => {
  const [count, setCount] = useState(props.count + props.secretCount)

  const [isActive, setActive] = useState(props.isActive)

  const onClickChip = () => {
    setCount(isActive ? count - 1 : count + 1)
    setActive(!isActive)
    props.onClick()
  }

  return (
    <Chip
      sx={{ borderRadius: 1 }}
      label={`${props.text} ${count}`}
      size={"small"}
      variant={"outlined"}
      color={isActive ? "primary" : "default"}
      onClick={(event) => {
        event.stopPropagation()
        onClickChip()
      }}
    />
  )
}
