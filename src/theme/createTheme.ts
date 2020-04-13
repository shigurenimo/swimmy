import { blue, cyan, grey, orange } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'
import { Shadows } from '@material-ui/core/styles/shadows'
import { toColorSwitcher } from './helpers/toColorSwitcher'
import { toShadowsSwitcher } from './helpers/toShadowsSwitcher'
import { Mode } from './types/mode'

export const createTheme = (mode: Mode = 'light') => {
  const isDark = mode === 'dark' || mode === 'red'

  const toColor = toColorSwitcher(mode)

  const toShadows = toShadowsSwitcher(mode)

  const {
    shadows,
    palette: { background, divider },
  } = createMuiTheme({
    palette: { type: isDark ? 'dark' : 'light' },
  })

  const shadow = `0 0 1px 1px ${divider}`

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
        default: toColor('#fff', background.default, blue[900]),
        paper: toColor('#fff', '#35353a', blue[800]),
      },
      divider: toColor('rgba(0, 0, 0, 0.08)', divider, '#fff'),
      primary: {
        main: toColor(cyan.A700, cyan.A200, grey['200']),
        contrastText: '#fff',
      },
      secondary: { main: toColor(orange.A400, orange.A400, orange.A200) },
      type: isDark ? 'dark' : 'light',
    },
    props: { MuiButtonBase: { disableRipple: true } },
    shadows: toShadows(
      shadows.map((_, i) => (i === 0 ? 'none' : shadow)) as Shadows,
      shadows.map((_, i) => 'none') as Shadows,
      shadows.map((_, i) => 'none') as Shadows
    ),
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: ['Helvetica', 'Roboto', 'sans-serif'].join(','),
      body1: { fontWeight: 'bold' },
      body2: { fontWeight: 'bold' },
    },
  })
}

if (process.env.NODE_ENV === 'development') {
  window.theme = createTheme('light')
}
