import { CssBaseline } from '@material-ui/core'
import { StylesProvider, ThemeProvider } from '@material-ui/styles'
import { useDarkMode } from '@reiwa/dark'
import React, { FunctionComponent } from 'react'
import { BrowserRouter } from 'react-router-dom'
import SwitchApp from './SwitchApp'
import { createTheme } from './theme/createTheme'

const App: FunctionComponent = () => {
  const dark = useDarkMode()

  const theme = createTheme({ dark })

  return (
    <StylesProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <SwitchApp />
          <footer />
        </BrowserRouter>
        <CssBaseline />
      </ThemeProvider>
    </StylesProvider>
  )
}

export default App
