import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'
import {
  createGenerateClassName,
  StylesProvider,
  ThemeProvider
} from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import AppRouter from './AppRouter'
import AppAuthProvider from './components/AppAuthProvider'
import { theme } from './libs/theme'

const generateClassName = createGenerateClassName({ productionPrefix: 'c' })

const App: FunctionComponent = () => {
  return (
    <StylesProvider generateClassName={generateClassName}>
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
    </StylesProvider>
  )
}

export default App
