import { NoSsr, Stack } from "@mui/material"
import { BoxHeader } from "app/core/components/box/BoxHeader"
import { BoxNavigation } from "app/core/components/box/BoxNavigation"
import { BoxNavigationsFallback } from "app/core/components/box/BoxNavigationsFallback"
import { DialogLogin } from "app/core/components/dialog/DialogLogin"
import { DialogLogout } from "app/core/components/dialog/DialogLogout"
import { DrawerNavigation } from "app/core/components/drawer/DrawerNavigation"
import { useDense } from "app/core/hooks/useDense"
import { useTwoColumn } from "app/core/hooks/useTwoColumn"
import login from "app/home/mutations/login"
import logout from "app/home/mutations/logout"
import { Head, useMutation, useRouter } from "blitz"
import {
  getAuth,
  getIdToken,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { useSnackbar } from "notistack"
import { FC, ReactNode, Suspense, useState } from "react"

type Props = {
  title?: string
  children: ReactNode
}

export const LayoutHome: FC<Props> = (props) => {
  const isTwoColumn = useTwoColumn()

  const isDense = useDense()

  const isOneColumn = !isTwoColumn

  const router = useRouter()

  const onLogout = async () => {
    try {
      router.replace("/")
      await logoutMutation()
      setOpenDialogLogout(false)
      enqueueSnackbar("ログアウトしました")
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  const [loginMutation, { isLoading }] = useMutation(login)

  const [logoutMutation] = useMutation(logout)

  const { enqueueSnackbar } = useSnackbar()

  const [isOpenDialogLogin, setOpenDialogLogin] = useState(false)

  const [isOpenDialogLogout, setOpenDialogLogout] = useState(false)

  const [isOpenDrawer, setOpenDrawer] = useState(false)

  const onLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const credential = await signInWithPopup(getAuth(), provider)
      const idToken = await getIdToken(credential.user)
      await loginMutation({ idToken })
      setOpenDialogLogin(false)
      enqueueSnackbar("ログインしました")
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  const onLoginWithPassword = async (username: string, password: string) => {
    try {
      const email = username.includes("@") ? username : `${username}@swimmy.io`
      const credential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
      )
      const idToken = await getIdToken(credential.user)
      await loginMutation({ idToken })
      setOpenDialogLogin(false)
      enqueueSnackbar("ログインしました")
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  const onOpenDialogLogout = () => {
    if (isOpenDrawer) {
      setOpenDrawer(false)
    }

    setOpenDialogLogout(true)
  }

  const onOpenDialogLogin = () => {
    if (isOpenDrawer) {
      setOpenDrawer(false)
    }

    setOpenDialogLogin(true)
  }

  const onCloseDialog = () => {
    if (isOpenDialogLogin) {
      setOpenDialogLogin(false)
    }

    if (isOpenDialogLogout) {
      setOpenDialogLogout(false)
    }
  }

  return (
    <>
      <Head>
        <title>{props.title || "スイミー電子掲示板"}</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>
      <NoSsr>
        <Stack direction={isTwoColumn ? "row" : "column"} position={"relative"}>
          {isOneColumn && (
            <BoxHeader
              onLogout={onOpenDialogLogout}
              onLogin={onOpenDialogLogin}
              onOpenDrawer={() => {
                setOpenDrawer(true)
              }}
            />
          )}
          {isTwoColumn && (
            <Suspense fallback={<BoxNavigationsFallback />}>
              <BoxNavigation
                onLogout={onOpenDialogLogout}
                onLogin={onOpenDialogLogin}
                isDense={isDense}
              />
            </Suspense>
          )}
          {props.children}
        </Stack>
      </NoSsr>
      <DialogLogin
        isOpen={isOpenDialogLogin}
        isLoading={isLoading}
        onLoginWithGoogle={onLoginWithGoogle}
        onLoginWithPassword={onLoginWithPassword}
        onClose={onCloseDialog}
      />
      <DialogLogout
        isOpen={isOpenDialogLogout}
        onLogout={onLogout}
        onClose={onCloseDialog}
      />
      <Suspense fallback={null}>
        <DrawerNavigation
          pathname={router.pathname}
          onLogout={onOpenDialogLogout}
          onLogin={onOpenDialogLogin}
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
