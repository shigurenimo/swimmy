import { analytics } from 'firebase/app'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    analytics().setCurrentScreen(location.pathname)
  }, [location.pathname])
}
