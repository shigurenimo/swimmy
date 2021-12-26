import { Box, Stack } from "@mui/material"
import React, { FC } from "react"

export const BoxMain: FC = (props) => {
  return (
    <Box flex={1}>
      <Stack
        sx={{
          py: 2,
          width: "100%",
          maxWidth(theme) {
            return theme.spacing(80)
          },
          minWidth(theme) {
            return {
              md: theme.spacing(40),
              lg: theme.spacing(60),
            }
          },
          margin: "0 auto",
        }}
      >
        {props.children}
      </Stack>
    </Box>
  )
}
