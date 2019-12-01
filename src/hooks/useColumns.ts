import { useMediaQuery, useTheme } from '@material-ui/core'
import { useLocation } from 'react-router'

export const useColumns = () => {
  const location = useLocation()

  const { breakpoints } = useTheme()

  const isDesktop = useMediaQuery(breakpoints.up('md'))

  const isHome = location.pathname === '/'

  const isThreadDetail = location.pathname.includes('/threads/')

  return isDesktop && (isHome || isThreadDetail)
}
