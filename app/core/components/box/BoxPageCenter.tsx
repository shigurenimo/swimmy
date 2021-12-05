import { Stack } from "@mui/material"
import React, { FunctionComponent } from "react"

export const BoxPageCenter: FunctionComponent = (props) => {
  return (
    <Stack
      sx={{
        position: "fixed",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
      }}
    >
      <Stack
        spacing={4}
        sx={{ width: "100%", maxWidth: (theme) => theme.spacing(80) }}
      >
        {props.children}
      </Stack>
    </Stack>
  )
}
