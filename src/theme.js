import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import blue from '@material-ui/core/colors/blue'
import pink from '@material-ui/core/colors/pink'

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
  }
}

const palette = {
  primary: { main: blue[500] },
  secondary: { main: pink[500] },
  background: { default: '#ffffff' }
}

const shadowKeyUmbraOpacity = 0.01 // 0.2
const shadowKeyPenumbraOpacity = 0.14 // 0.14
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
  createShadow(0, 1, 3, 0, 0, 1, 5, 0, 0, 2, 1, -1),
  createShadow(0, 1, 5, 0, 0, 2, 10, 0, 0, 3, 1, -2),
  createShadow(0, 1, 8, 0, 0, 3, 20, 0, 0, 3, 3, -2),
  createShadow(0, 2, 4, -1, 0, 4, 25, 0, 0, 1, 10, 0),
  createShadow(0, 3, 5, -1, 0, 5, 40, 0, 0, 1, 14, 0),
  createShadow(0, 3, 5, -1, 0, 6, 50, 0, 0, 1, 18, 0),
  createShadow(0, 4, 5, -2, 0, 7, 50, 1, 0, 2, 16, 1),
  createShadow(0, 5, 5, -3, 0, 8, 50, 1, 0, 3, 14, 2),
  createShadow(0, 5, 6, -3, 0, 9, 60, 1, 0, 3, 16, 2),
  createShadow(0, 6, 6, -3, 0, 10, 70, 1, 0, 4, 18, 3),
  createShadow(0, 6, 7, -4, 0, 11, 75, 1, 0, 4, 20, 3),
  createShadow(0, 7, 8, -4, 0, 12, 85, 2, 0, 5, 22, 4),
  createShadow(0, 7, 8, -4, 0, 13, 95, 2, 0, 5, 24, 4),
  createShadow(0, 7, 9, -4, 0, 14, 105, 2, 0, 5, 26, 4),
  createShadow(0, 8, 9, -5, 0, 15, 110, 2, 0, 6, 28, 5),
  createShadow(0, 8, 10, -5, 0, 16, 120, 2, 0, 6, 30, 5),
  createShadow(0, 8, 11, -5, 0, 17, 130, 2, 0, 6, 32, 5),
  createShadow(0, 9, 11, -5, 0, 18, 140, 2, 0, 7, 34, 6),
  createShadow(0, 9, 12, -6, 0, 19, 145, 2, 0, 7, 36, 6),
  createShadow(0, 10, 13, -6, 0, 20, 155, 3, 0, 8, 38, 7),
  createShadow(0, 10, 13, -6, 0, 21, 155, 3, 0, 8, 40, 7),
  createShadow(0, 10, 14, -6, 0, 22, 175, 3, 0, 8, 42, 7),
  createShadow(0, 11, 14, -7, 0, 23, 180, 3, 0, 9, 44, 8),
  createShadow(0, 11, 15, -7, 0, 24, 190, 3, 0, 9, 46, 8)
]

export const theme = createMuiTheme({
  shape,
  overrides,
  palette,
  shadows
})
