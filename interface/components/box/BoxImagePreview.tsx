import CloseIcon from "@mui/icons-material/CloseRounded"
import { Box, IconButton, Stack } from "@mui/material"
import Image from "next/image"
import React, { FC } from "react"

type Props = {
  fileId: string
  onDelete(): void
}

export const BoxImagePreview: FC<Props> = (props) => {
  return (
    <Box>
      <Stack
        sx={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          height: 160,
          borderRadius: 1,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: (theme) => theme.palette.divider,
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
        />
        <Stack
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.6)",
            },
          }}
        >
          <Stack sx={{ position: "absolute", top: 16, right: 16 }}>
            <IconButton onClick={props.onDelete}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
