import { blue, cyan, grey, orange } from '@material-ui/core/colors'
import { createTheme } from '@material-ui/core/styles'
import { Shadows } from '@material-ui/core/styles/shadows'
import { Mode } from '../types/mode'
import { toColorSwitcher } from './toColorSwitcher'
import { toShadowsSwitcher } from './toShadowsSwitcher'

export const createAppTheme = (mode: Mode = 'light') => {
  const isDark = mode === 'dark' || mode === 'red'

  const toColor = toColorSwitcher(mode)

  const toShadows = toShadowsSwitcher(mode)

  const {
    shadows,
    palette: { background, divider },
  } = createTheme({ palette: { mode: isDark ? 'dark' : 'light' } })

  const shadow = `0 0 1px 1px ${divider}`

  return createTheme({
    components: {
      MuiButtonBase: {
        defaultProps: { disableRipple: true },
      },
      MuiCardHeader: {
        styleOverrides: { action: { marginTop: 0 } },
      },
      MuiDrawer: {
        styleOverrides: {
          paperAnchorDockedLeft: isDark ? {} : { borderRight: 'none' },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: { '&:last-child': { borderBottom: 0 } },
          button: { '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } },
        },
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
      },
      secondary: { main: toColor(orange.A400, orange.A400, orange.A200) },
      mode: isDark ? 'dark' : 'light',
    },
    shadows: toShadows(
      shadows.map((_, i) => (i === 0 ? 'none' : shadow)) as Shadows,
      shadows.map((_, i) => 'none') as Shadows,
      shadows.map((_, i) => 'none') as Shadows
    ),
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: [
        'Hiragino Kaku Gothic ProN',
        'ヒラギノ角ゴ ProN W3',
        'Hiragino Sans',
        'ヒラギノ角ゴシック',
        'sans-serif',
      ].join(','),
    },
  })
}

if (process.env.NODE_ENV === 'development') {
  window.theme = createAppTheme('light')
}
