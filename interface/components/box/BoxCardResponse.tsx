import { Stack, Typography } from "@mui/material"
import { FC } from "react"
import { useDateText } from "interface/hooks/useDateText"

type Props = {
  createdAt: number
  index: number
  text: string | null
  onClick?(): void
}

export const BoxCardResponse: FC<Props> = (props) => {
  const dateText = useDateText(new Date(props.createdAt * 1000))

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
      {props.text && (
        <Typography fontWeight={"bold"} sx={{ whiteSpace: "pre-wrap" }}>
          {props.text}
        </Typography>
      )}
    </Stack>
  )
}
