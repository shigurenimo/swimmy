import { Theme, useMediaQuery } from "@mui/material"

export const useDense = () => {
  return useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"), {
    noSsr: true,
  })
}
