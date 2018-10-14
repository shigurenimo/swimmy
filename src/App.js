import CssBaseline from '@material-ui/core/CssBaseline'
import { createGenerateClassName } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component, Fragment } from 'react'
import JssProvider from 'react-jss/lib/JssProvider'
import AppRouter from './AppRouter'
import AppAuthProvider from './containers/AppAuthProvider'
import { theme } from './theme'

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: false,
  productionPrefix: 'c'
})

class App extends Component {
  render() {
    return (
      <JssProvider generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <AppAuthProvider>
            <Fragment>
              <CssBaseline />
              <AppRouter />
            </Fragment>
          </AppAuthProvider>
        </MuiThemeProvider>
      </JssProvider>
    )
  }
}

const styles = () => ({})

export default withStyles(styles)(App)
