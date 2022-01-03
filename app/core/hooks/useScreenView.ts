import { useRouter } from "blitz"
import { getAnalytics, logEvent, setCurrentScreen } from "firebase/analytics"
import { useEffect } from "react"

export const useScreenView = (className: string) => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    if (typeof window === "undefined") return
    setCurrentScreen(getAnalytics(), window.location.pathname)
    logEvent(getAnalytics(), "screen_view", {
      firebase_screen: router.asPath,
      firebase_screen_class: className,
    })
  }, [router.isReady, router.asPath, className])
}
