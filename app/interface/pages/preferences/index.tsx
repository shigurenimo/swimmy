import { Box } from "@mui/material"
import { LayoutHome } from "app/interface/core/layouts/LayoutHome"
import { BlitzPage } from "blitz"

const PagePreferences: BlitzPage = () => {
  return <Box />
}

PagePreferences.getLayout = (page) => {
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PagePreferences
