import { getAnalytics, logEvent } from "firebase/analytics"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const useScreenView = (className: string) => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    if (typeof window === "undefined") return
    if (process.env.NODE_ENV === "development") return
    logEvent(getAnalytics(), "page_view", {
      page_location: document.title,
      page_path: window.location.href,
      page_title: window.location.pathname,
    })
  }, [router.isReady, router.asPath, className])
}
