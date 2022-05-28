import { Stack } from "@mui/material"
import { FC, ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const BoxPageCenter: FC<Props> = (props) => {
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
