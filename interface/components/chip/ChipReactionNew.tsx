import { Chip, ChipProps } from "@mui/material"
import { FC } from "react"

type Props = ChipProps & {
  onClick(): void
}

export const ChipReactionNew: FC<Props> = ({ onClick, ...props }) => {
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
