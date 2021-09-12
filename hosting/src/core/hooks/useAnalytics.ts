import { getAnalytics, setCurrentScreen } from 'firebase/analytics'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    setCurrentScreen(getAnalytics(), location.pathname)
  }, [location.pathname])
}
