import { createTheme } from '@material-ui/core/styles'
import { Mode } from 'src/core/types/mode'

export const useTheme = (mode: Mode = 'light') => {
  const isDark = mode === 'dark' || mode === 'red'

  const theme = createTheme({
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
      /*
      background: {
        default: toColor('#fff', background.default, blue[900]),
        paper: toColor('#fff', '#35353a', blue[800]),
      },
      */
      // divider: toColor('rgba(0, 0, 0, 0.08)', divider, '#fff'),
      // primary: { main: toColor(cyan.A700, cyan.A200, grey['200']) },
      // secondary: { main: toColor(orange.A400, orange.A400, orange.A200) },
      // mode: isDark ? 'dark' : 'light',
    },
    /*
    shadows: toShadows(
      shadows.map((_, i) => (i === 0 ? 'none' : shadow)) as Shadows,
      shadows.map((_, i) => 'none') as Shadows,
      shadows.map((_, i) => 'none') as Shadows
    ),
    */
    shape: { borderRadius: 3 },
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

  if (process.env.NODE_ENV === 'development') {
    window.theme = theme
  }

  return theme
}
