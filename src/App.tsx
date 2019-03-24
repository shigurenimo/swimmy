import { CssBaseline } from '@material-ui/core'
import { StylesProvider, ThemeProvider } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import AppAuthProvider from './components/AppAuthProvider'
import { createTheme } from './helpers/createTheme'
import RouteIndex from './routes/RouteIndex'

const theme = createTheme()

const App: FunctionComponent = () => {
  return (
    <StylesProvider>
      <ThemeProvider theme={theme}>
        <AppAuthProvider>
          <CssBaseline />
          <RouteIndex />
        </AppAuthProvider>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default App
