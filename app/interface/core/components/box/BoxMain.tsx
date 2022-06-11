import { Box, Stack, StackProps } from "@mui/material"
import React, { FC } from "react"

type Props = StackProps

export const BoxMain: FC<Props> = (props) => {
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
        {...props}
      >
        {props.children}
      </Stack>
    </Box>
  )
}
