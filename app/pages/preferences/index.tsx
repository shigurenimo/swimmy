import { Box } from "@mui/material"
import { LayoutHome } from "app/core/layouts/LayoutHome"
import { BlitzPage } from "blitz"
import React from "react"

const PagePreferences: BlitzPage = () => {
  return <Box />
}

PagePreferences.getLayout = (page) => {
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PagePreferences
