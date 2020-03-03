import { cyan, orange } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

export const createTheme = ({ dark = false }) => {
  const { palette } = createMuiTheme({
    palette: { type: dark ? 'dark' : 'light' },
  })

  return createMuiTheme({
    palette: {
      background: {
        default: dark ? palette.background.default : 'transparent',
        paper: dark ? palette.background.default : '#fff',
      },
      divider: dark ? palette.divider : 'rgba(0, 0, 0, 0.08)',
      primary: { main: cyan.A700, contrastText: '#fff' },
      secondary: { main: orange.A400 },
      type: dark ? 'dark' : 'light',
    },
    // props: { MuiButtonBase: { disableRipple: true } },
    shape: { borderRadius: 4 },
    typography: { fontFamily: ['Helvetica', 'Roboto', 'sans-serif'].join(',') },
  })
}

if (process.env.NODE_ENV === 'development') {
  window.theme = createTheme({ dark: true })
}
