import { Stack } from "@mui/material"
import React, { FunctionComponent } from "react"

type Props = {
  onClick?(): void
  isActive?: boolean
}

export const BoxCardPostFrame: FunctionComponent<Props> = (props) => {
  const isClickable = typeof props.onClick !== "undefined"

  return (
    <Stack
      onClick={props.onClick}
      spacing={2}
      sx={{
        p: 2,
        width: "100%",
        backgroundColor: (theme) =>
          props.isActive ? theme.palette.background.paper : "transparent",
        borderWidth: 1,
        borderRadius: 1,
        borderColor: (theme) => theme.palette.divider,
        borderStyle: "solid",
        // background: (theme) => theme.palette.background.paper,
        "&:hover": isClickable
          ? {
              borderColor: (theme) => theme.palette.action.active,
              // background: (theme) => theme.palette.action.hover,
            }
          : {},
      }}
    >
      {props.children}
    </Stack>
  )
}
