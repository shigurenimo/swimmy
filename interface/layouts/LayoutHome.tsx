import { NoSsr, Stack } from "@mui/material"
import Head from "next/head"
import { useRouter } from "next/router"
import { FC, ReactNode, Suspense, useState } from "react"
import { BoxHeader } from "interface/components/box/BoxHeader"
import { BoxNavigation } from "interface/components/box/BoxNavigation"
import { BoxNavigationsFallback } from "interface/components/box/BoxNavigationsFallback"
import { DrawerNavigation } from "interface/components/drawer/DrawerNavigation"
import { useDense } from "interface/hooks/useDense"
import { useTwoColumn } from "interface/hooks/useTwoColumn"

type Props = {
  title?: string
  children: ReactNode
}

export const LayoutHome: FC<Props> = (props) => {
  const isTwoColumn = useTwoColumn()

  const isDense = useDense()

  const isOneColumn = !isTwoColumn

  const router = useRouter()

  const [isOpenDrawer, setOpenDrawer] = useState(false)

  return (
    <>
      <Head>
        <title>
          {typeof props.title === "string"
            ? `${props.title} | スイミー電子掲示板`
            : "スイミー電子掲示板"}
        </title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>
      <NoSsr>
        <Stack direction={isTwoColumn ? "row" : "column"} position={"relative"}>
          {isOneColumn && (
            <BoxHeader
              onOpenDrawer={() => {
                setOpenDrawer(true)
              }}
            />
          )}
          {isTwoColumn && (
            <Suspense fallback={<BoxNavigationsFallback />}>
              <BoxNavigation
                isDense={isDense}
              />
            </Suspense>
          )}
          {props.children}
        </Stack>
      </NoSsr>
      <Suspense fallback={null}>
        <DrawerNavigation
          pathname={router.pathname}
          isOpen={isOpenDrawer}
          isDense={false}
          onClose={() => {
            setOpenDrawer(false)
          }}
        />
      </Suspense>
    </>
  )
}
