import { Stack, Typography } from "@mui/material"
import { useDateText } from "app/core/hooks/useDateText"
import { AppPost } from "integrations/types"
import { FC } from "react"

type Props = AppPost & {
  index: number
  onClick?(): void
}

export const BoxCardResponse: FC<Props> = (props) => {
  const dateText = useDateText(props.createdAt)

  return (
    <Stack spacing={0.5} sx={{ width: "100%" }}>
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        <Typography fontSize={14} sx={{ fontWeight: "bold" }}>
          {props.index}
        </Typography>
        <Typography fontSize={10} sx={{ opacity: 0.6, letterSpacing: 0.4 }}>
          {dateText}
        </Typography>
      </Stack>
      <Typography fontWeight={"bold"} sx={{ whiteSpace: "pre-wrap" }}>
        {props.text}
      </Typography>
    </Stack>
  )
}
