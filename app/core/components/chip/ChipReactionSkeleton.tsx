import { Chip, Skeleton } from "@mui/material"
import React, { FunctionComponent } from "react"

export const ChipReactionSkeleton: FunctionComponent = () => {
  return (
    <Chip
      sx={{ borderRadius: 1 }}
      label={<Skeleton variant={"text"} width={16} />}
      size={"small"}
      variant={"outlined"}
      color={"default"}
    />
  )
}
