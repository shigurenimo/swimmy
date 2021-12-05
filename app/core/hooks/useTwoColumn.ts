import { Theme, useMediaQuery } from "@mui/material"

export const useTwoColumn = () => {
  return useMediaQuery<Theme>((theme) => theme.breakpoints.up("sm"), {
    noSsr: true,
  })
}
