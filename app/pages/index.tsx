import { Button } from "@mui/material"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import React from "react"

const Home: BlitzPage = () => {
  return <Button variant={"contained"}>{"Hello World"}</Button>
}

// Home.suppressFirstRenderFlicker = true

Home.getLayout = (page) => {
  return <Layout title="Home">{page}</Layout>
}

export default Home
