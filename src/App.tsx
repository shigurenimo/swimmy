import CssBaseline from '@material-ui/core/CssBaseline'
import { createGenerateClassName } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import React, { Fragment, SFC } from 'react'
import JssProvider from 'react-jss/lib/JssProvider'
import AppRouter from './AppRouter'
import AppAuthProvider from './containers/AppAuthProvider'
import { theme } from './libs/theme'

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: false,
  productionPrefix: 'c'
})

const App: SFC = () => {
  return (
    <JssProvider generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <AppAuthProvider>
            <Fragment>
              <CssBaseline />
              <AppRouter />
            </Fragment>
          </AppAuthProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </JssProvider>
  )
}

export default App
