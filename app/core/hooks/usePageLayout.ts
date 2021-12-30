import { Theme, useMediaQuery } from "@mui/material"

export const usePageLayout = (hasPage: boolean) => {
  const isMd = useMediaQuery<Theme>((theme) => theme.breakpoints.up("md"), {
    noSsr: true,
  })

  const asideFallback = isMd && !hasPage

  const aside = hasPage

  const main = isMd || !hasPage

  return {
    asideFallback: asideFallback,
    aside: aside,
    main: main,
  }
}
