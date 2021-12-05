import { Chip, ChipProps } from "@mui/material"
import React, { FunctionComponent, useState } from "react"

type Props = ChipProps & {
  text: string
  count: number
  isActive: boolean
  onClick(): void
}

export const ChipReaction: FunctionComponent<Props> = ({
  onClick,
  isActive: isActiveInitialState,
  ...props
}) => {
  const [count, setCount] = useState(props.count)

  const [isActive, setActive] = useState(isActiveInitialState)

  const onClickChip = () => {
    setCount(isActive ? count - 1 : count + 1)
    setActive(!isActive)
    onClick()
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
      {...props}
    />
  )
}
