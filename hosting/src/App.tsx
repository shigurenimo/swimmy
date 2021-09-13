import { CssBaseline, ThemeProvider } from '@mui/material'
import { ErrorBoundary } from '@sentry/react'
import { SnackbarProvider } from 'notistack'
import React, { FunctionComponent } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useNight } from 'src/core/hooks/useNight'
import { useAppTheme } from 'src/core/utils/useAppTheme'
import { Router } from 'src/Router'

const queryClient = new QueryClient()

export const App: FunctionComponent = () => {
  const mode = useNight()

  const theme = useAppTheme(mode)

  return (
    <ErrorBoundary fallback={<p>{'エラーが発生しました。'}</p>}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            <Router />
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
