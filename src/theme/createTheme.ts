import { cyan, orange } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

export const createTheme = ({ dark = false }) => {
  const theme = createMuiTheme({
    palette: { type: dark ? 'dark' : 'light' }
  })

  return createMuiTheme({
    overrides: {
      MuiBackdrop: { root: { backgroundColor: 'rgba(255, 255, 255, 0.8)' } },
      MuiPaper: dark
        ? {}
        : {
            elevation1: { boxShadow: '0 2px 8px rgba(214, 214, 224, 1)' },
            elevation2: { boxShadow: '0 2px 8px rgba(214, 214, 224, 1)' },
            elevation4: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }
          }
    },
    palette: {
      type: dark ? 'dark' : 'light',
      background: {
        default: dark ? theme.palette.background.default : '#ffffff'
      },
      divider: 'rgba(0, 0, 0, 0.08)',
      primary: { main: cyan.A700, contrastText: '#fff' },
      secondary: { main: orange.A400 }
    },
    props: { MuiButtonBase: { disableRipple: true } },
    shape: { borderRadius: 0 },
    typography: { fontFamily: ['Helvetica', 'Roboto', 'sans-serif'].join(',') }
  })
}

if (process.env.NODE_ENV === 'development') {
  window.theme = createTheme({ dark: true })
}
