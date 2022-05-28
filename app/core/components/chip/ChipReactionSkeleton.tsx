import { Chip, Skeleton } from "@mui/material"
import { FC } from "react"

export const ChipReactionSkeleton: FC = () => {
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
