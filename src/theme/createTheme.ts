import { cyan, orange } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

export const createTheme = ({ dark = false }) => {
  const { palette } = createMuiTheme({
    palette: { type: dark ? 'dark' : 'light' },
  })

  return createMuiTheme({
    overrides: {
      MuiPaper: {
        elevation1: { boxShadow: 'none' },
        elevation2: { boxShadow: 'none' },
        elevation4: { boxShadow: 'none' },
        root: { backgroundColor: dark ? palette.background.default : '#fff' },
      },
    },
    palette: {
      type: dark ? 'dark' : 'light',
      background: { default: dark ? palette.background.default : '#ffffff' },
      divider: dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      primary: { main: cyan.A700, contrastText: '#fff' },
      secondary: { main: orange.A400 },
    },
    props: { MuiButtonBase: { disableRipple: true } },
    shape: { borderRadius: 0 },
    typography: { fontFamily: ['Helvetica', 'Roboto', 'sans-serif'].join(',') },
  })
}

if (process.env.NODE_ENV === 'development') {
  window.theme = createTheme({ dark: true })
}
