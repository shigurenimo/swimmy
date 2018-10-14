import blue from '@material-ui/core/colors/blue'
import pink from '@material-ui/core/colors/pink'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

const shadowKeyUmbraOpacity = 0.2 // 0.2
const shadowKeyPenumbraOpacity = 0 // 0.14
const shadowAmbientShadowOpacity = 0.12 // 0.12

const createShadow = function() {
  return [
    ''
      .concat(arguments.length <= 0 ? undefined : arguments[0], 'px ')
      .concat(arguments.length <= 1 ? undefined : arguments[1], 'px ')
      .concat(arguments.length <= 2 ? undefined : arguments[2], 'px ')
      .concat(
        arguments.length <= 3 ? undefined : arguments[3],
        'px rgba(0, 0, 0, '
      )
      .concat(shadowKeyUmbraOpacity, ')'),
    ''
      .concat(arguments.length <= 4 ? undefined : arguments[4], 'px ')
      .concat(arguments.length <= 5 ? undefined : arguments[5], 'px ')
      .concat(arguments.length <= 6 ? undefined : arguments[6], 'px ')
      .concat(
        arguments.length <= 7 ? undefined : arguments[7],
        'px rgba(0, 0, 0, '
      )
      .concat(shadowKeyPenumbraOpacity, ')'),
    ''
      .concat(arguments.length <= 8 ? undefined : arguments[8], 'px ')
      .concat(arguments.length <= 9 ? undefined : arguments[9], 'px ')
      .concat(arguments.length <= 10 ? undefined : arguments[10], 'px ')
      .concat(
        arguments.length <= 11 ? undefined : arguments[11],
        'px rgba(0, 0, 0, '
      )
      .concat(shadowAmbientShadowOpacity, ')')
  ].join(',')
}

const shadows = [
  'none',
  createShadow(0, 1, 3, 0, 0, 1, 1, 0, 0, 2, 1, -1),
  createShadow(0, 1, 5, 0, 0, 2, 2, 0, 0, 3, 1, -2),
  createShadow(0, 1, 8, 0, 0, 3, 4, 0, 0, 3, 3, -2),
  createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0),
  createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0),
  createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0),
  createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1),
  createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2),
  createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2),
  createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3),
  createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3),
  createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4),
  createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4),
  createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4),
  createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5),
  createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5),
  createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5),
  createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6),
  createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6),
  createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7),
  createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7),
  createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7),
  createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8),
  createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)
]

const typography = {
  useNextVariants: true
}

const shape = { borderRadius: 4 }

const overrides = {
  MuiDivider: {
    root: {
      backgroundColor: 'rgba(0, 0, 0, 0.32)'
    }
  },
  MuiDrawer: {
    paper: {
      backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    paperAnchorDockedLeft: {
      borderRight: 0
    }
  },
  MuiBackdrop: {
    root: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
  },
  MuiAppBar: {
    root: {
      boxShadow: shadows[1]
    }
  }
}

const palette = {
  primary: { main: blue['A700'] },
  secondary: { main: pink[500] },
  background: { default: '#ffffff' }
}

export const theme = createMuiTheme({
  typography,
  shape,
  overrides,
  palette,
  shadows
})

if (process.env.NODE_ENV === 'development') {
  window.theme = theme
}
