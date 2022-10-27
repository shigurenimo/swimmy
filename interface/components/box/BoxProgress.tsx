import { Box } from "@mui/material"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"

const BoxProgress: FC = () => {
  const router = useRouter()

  useEffect(() => {
    const onRouteChangeStart = () => {}

    const onRouteChangeComplete = () => {}

    router.events.on("routeChangeStart", onRouteChangeStart)
    router.events.on("routeChangeComplete", onRouteChangeComplete)

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart)
      router.events.off("routeChangeComplete", onRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Box />
}
