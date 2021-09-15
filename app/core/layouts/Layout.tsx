import { Head } from "blitz"
import { FunctionComponent, ReactNode } from "react"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout: FunctionComponent<LayoutProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.title || "スイミー電子掲示板"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {props.children}
    </>
  )
}

export default Layout
