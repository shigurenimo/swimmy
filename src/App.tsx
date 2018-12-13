import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { createGenerateClassName, ThemeProvider } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import JssProvider from 'react-jss/lib/JssProvider'
import AppRouter from './AppRouter'
import AppAuthProvider from './containers/AppAuthProvider'
import { theme } from './libs/theme'

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: false,
  productionPrefix: 'c'
})

const App: FunctionComponent = () => {
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
