import { BoxPageError404 } from "app/core/components/box/BoxPageError404"
import { BlitzPage, Head } from "blitz"

const Page404: BlitzPage = () => {
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
