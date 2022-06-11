import { Grid, Skeleton, Stack, Typography } from "@mui/material"
import { BoxCardPostFrame } from "app/interface/components/box/BoxCardPostFrame"
import { ChipReactionSkeleton } from "app/interface/components/chip/ChipReactionSkeleton"
import { FC } from "react"

type Props = {}

export const BoxCardPostSkeleton: FC<Props> = () => {
  return (
    <BoxCardPostFrame>
      <Stack spacing={0.5}>
        <Stack direction={"row"}>
          <Typography fontSize={10} sx={{ opacity: 0.6, letterSpacing: 0.4 }}>
            <Skeleton variant={"text"} width={80} />
          </Typography>
        </Stack>
        <Typography fontWeight={"bold"}>
          <Skeleton variant={"text"} />
        </Typography>
        <Grid container gap={1}>
          <Grid item>
            <ChipReactionSkeleton />
          </Grid>
          <Grid item>
            <ChipReactionSkeleton />
          </Grid>
        </Grid>
      </Stack>
    </BoxCardPostFrame>
  )
}
