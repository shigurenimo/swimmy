import { blue, pink } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

const shape = { borderRadius: 4 }

export const createTheme = () => {
  return createMuiTheme({
    overrides: {
      MuiBackdrop: { root: { backgroundColor: 'rgba(255, 255, 255, 0.8)' } },
      MuiDivider: { root: { backgroundColor: 'rgba(0, 0, 0, 0.32)' } },
      MuiDrawer: {
        paper: { backgroundColor: 'rgba(0, 0, 0, 0)' },
        paperAnchorDockedLeft: { borderRight: 0 }
      }
    },
    palette: {
      background: { default: '#ffffff' },
      primary: { main: blue.A700 },
      secondary: { main: pink[500] }
    },
    props: { MuiButtonBase: { disableRipple: true } },
    shape,
    typography: { fontFamily: ['Roboto', 'sans-serif'].join(',') }
  })
}

if (process.env.NODE_ENV === 'development') {
  window.theme = createTheme()
}
