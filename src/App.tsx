import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'
import {
  createGenerateClassName,
  StylesProvider,
  ThemeProvider
} from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import AppAuthProvider from './components/AppAuthProvider'
import { createTheme } from './helpers/createTheme'
import RouteIndex from './routes/RouteIndex'

const generateClassName = createGenerateClassName({ productionPrefix: 'c' })

const theme = createTheme()

const App: FunctionComponent = () => {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <AppAuthProvider>
            <CssBaseline />
            <RouteIndex />
          </AppAuthProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  )
}

export default App
