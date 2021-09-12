import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useNight } from 'src/core/hooks/useNight'
import { useTheme } from 'src/core/utils/createAppTheme'
import { Router } from 'src/Router'

const queryClient = new QueryClient()

export const App: FunctionComponent = () => {
  const mode = useNight()

  const theme = useTheme(mode)

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
