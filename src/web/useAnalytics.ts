import { analytics } from 'firebase/app'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    analytics().setCurrentScreen(location.pathname)
  }, [location.pathname])
}
