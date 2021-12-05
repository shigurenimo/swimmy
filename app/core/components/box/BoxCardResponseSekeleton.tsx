import { Skeleton, Stack, Typography } from "@mui/material"
import React, { FunctionComponent } from "react"

type Props = { index: number }

export const BoxCardResponseSekeleton: FunctionComponent<Props> = (props) => {
  return (
    <Stack spacing={0.5} sx={{ width: "100%" }}>
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        <Typography fontSize={14} sx={{ fontWeight: "bold" }}>
          {props.index}
        </Typography>
        <Typography fontSize={10} sx={{ opacity: 0.6, letterSpacing: 0.4 }}>
          <Skeleton variant={"text"} width={80} />
        </Typography>
      </Stack>
      <Typography fontWeight={"bold"} sx={{ whiteSpace: "pre-wrap" }}>
        <Skeleton variant={"text"} />
        <Skeleton variant={"text"} />
      </Typography>
    </Stack>
  )
}
