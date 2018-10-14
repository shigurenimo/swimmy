import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component, Fragment } from 'react'
import AppRouter from './AppRouter'
import AppAuthProvider from './containers/AppAuthProvider'
import { theme } from './theme'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <AppAuthProvider>
          <Fragment>
            <CssBaseline />
            <AppRouter />
          </Fragment>
        </AppAuthProvider>
      </MuiThemeProvider>
    )
  }
}

const styles = () => ({})

export default withStyles(styles)(App)
