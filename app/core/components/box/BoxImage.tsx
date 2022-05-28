import { Box, Stack } from "@mui/material"
import { Image } from "blitz"
import { FC } from "react"

type Props = {
  fileId: string
}

export const BoxImage: FC<Props> = (props) => {
  return (
    <Box sx={{ py: 1 }}>
      <Stack
        sx={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          height: 160,
          borderRadius: 1,
        }}
      >
        <Image
          loader={(props) => {
            const searchParams = new URLSearchParams([
              ["w", `${props.width}`],
              ["q", `${props.quality || 75}`],
            ])
            return `/api/images/${props.src}?${searchParams}`
          }}
          src={props.fileId}
          alt={props.fileId}
          width={640}
          height={640}
          objectFit={"cover"}
        />
      </Stack>
    </Box>
  )
}
