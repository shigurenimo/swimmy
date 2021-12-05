import { Chip, ChipProps } from "@mui/material"
import React, { FunctionComponent } from "react"

type Props = ChipProps & {
  onClick(): void
}

export const ChipReactionNew: FunctionComponent<Props> = ({
  onClick,
  ...props
}) => {
  return (
    <Chip
      sx={{ borderRadius: 1 }}
      label={"+"}
      size={"small"}
      variant={"outlined"}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      {...props}
    />
  )
}
