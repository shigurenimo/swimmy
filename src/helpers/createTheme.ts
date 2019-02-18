import blue from '@material-ui/core/colors/blue'
import pink from '@material-ui/core/colors/pink'
import { createMuiTheme } from '@material-ui/core/styles'

const typography = {
  fontFamily: ['Roboto', 'sans-serif'].join(','),
  useNextVariants: true
}

const shape = { borderRadius: 4 }

const overrides = {
  MuiBackdrop: { root: { backgroundColor: 'rgba(255, 255, 255, 0.8)' } },
  MuiDivider: { root: { backgroundColor: 'rgba(0, 0, 0, 0.32)' } },
  MuiDrawer: {
    paper: { backgroundColor: 'rgba(0, 0, 0, 0)' },
    paperAnchorDockedLeft: { borderRight: 0 }
  }
}

const palette = {
  background: { default: '#ffffff' },
  primary: { main: blue.A700 },
  secondary: { main: pink[500] }
}

const props = {
  MuiButtonBase: { disableRipple: true }
}

export const createTheme = () => {
  return createMuiTheme({
    overrides,
    palette,
    props,
    shape,
    typography
  })
}

if (process.env.NODE_ENV === 'development') {
  window.theme = createTheme()
}
