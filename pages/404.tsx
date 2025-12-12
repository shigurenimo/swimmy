import Head from "next/head"
import { BoxPageError404 } from "interface/components/box/BoxPageError404"

const Page404 = () => {
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
