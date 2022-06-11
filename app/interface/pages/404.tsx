import { BoxPageError404 } from "app/interface/components/box/BoxPageError404"
import { useScreenView } from "app/interface/hooks/useScreenView"
import { BlitzPage, Head } from "blitz"

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
