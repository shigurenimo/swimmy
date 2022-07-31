import { BlitzPage } from "@blitzjs/next"
import Head from "next/head"
import { BoxPageError404 } from "app/interface/components/box/BoxPageError404"
import { useScreenView } from "app/interface/hooks/useScreenView"

const Page404: BlitzPage = () => {
  useScreenView("Page404")

  return (
    <>
      <Head>
        <title>{"ページが見つかりません"}</title>
      </Head>
      <BoxPageError404 />
    </>
  )
}

export default Page404
