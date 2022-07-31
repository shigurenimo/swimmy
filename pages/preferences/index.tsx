import { BlitzPage } from "@blitzjs/next"
import { Box } from "@mui/material"
import { LayoutHome } from "app/interface/layouts/LayoutHome"

const PagePreferences: BlitzPage = () => {
  return <Box />
}

PagePreferences.getLayout = (page) => {
  return <LayoutHome title={"Home"}>{page}</LayoutHome>
}

export default PagePreferences
