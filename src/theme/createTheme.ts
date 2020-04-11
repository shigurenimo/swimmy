import { cyan, orange, red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'
import { Shadows } from '@material-ui/core/styles/shadows'

export const createTheme = (mode = 'light') => {
  const isDark = mode === 'dark' || mode === 'red'

  const isRed = mode === 'red'

  const { shadows, palette } = createMuiTheme({
    palette: { type: isDark ? 'dark' : 'light' },
  })

  const shadow = `0 0 1px 1px ${palette.divider}`

  return createMuiTheme({
    overrides: {
      MuiCardHeader: { action: { marginTop: 0 } },
      MuiDrawer: {
        paperAnchorDockedLeft: isDark ? {} : { borderRight: 'none' },
      },
      MuiListItem: {
        root: { '&:last-child': { borderBottom: 0 } },
        button: { '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } },
      },
    },
    palette: {
      background: {
        // red['A700']
        default: !isDark
          ? '#fff'
          : isRed
          ? red['A700']
          : palette.background.default,
        paper: !isDark ? '#fff' : isRed ? red['A700'] : '#35353a',
      },
      divider: isDark ? palette.divider : 'rgba(0, 0, 0, 0.08)',
      primary: { main: cyan.A700, contrastText: '#fff' },
      secondary: { main: orange.A400 },
      type: isDark ? 'dark' : 'light',
    },
    props: { MuiButtonBase: { disableRipple: true } },
    shadows: shadows.map((_, i) => (i === 0 ? 'none' : shadow)) as Shadows,
    shape: { borderRadius: 4 },
    typography: { fontFamily: ['Helvetica', 'Roboto', 'sans-serif'].join(',') },
  })
}

if (process.env.NODE_ENV === 'development') {
  window.theme = createTheme('light')
}
