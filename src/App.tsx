import { CssBaseline } from '@material-ui/core'
import { StylesProvider, ThemeProvider } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import { Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import AppAuthProvider from './components/AppAuthProvider'
import { createTheme } from './helpers/createTheme'
import RouteAbout from './routes/RouteAbout'
import RouteChangelogs from './routes/RouteChangelogs'
import RouteHome from './routes/RouteHome'
import RouteImages from './routes/RouteImages'
import RouterListener from './routes/RouteListener'
import RoutePolicy from './routes/RoutePolicy'
import RouteSettingsEmail from './routes/RouteSettingsEmail'
import RouteSettingsPassword from './routes/RouteSettingsPassword'
import RouteStats from './routes/RouteStats'
import RouteThread from './routes/RouteThread'
import RouteThreads from './routes/RouteThreads'

const theme = createTheme()

const App: FunctionComponent = () => {
  return (
    <StylesProvider>
      <ThemeProvider theme={theme}>
        <AppAuthProvider>
          <BrowserRouter>
            <Fragment>
              <RouterListener />
              <Switch>
                <Route component={RouteHome} exact path={'/'} />
                <Route component={RouteAbout} exact path={'/about'} />
                <Route component={RouteChangelogs} exact path={'/changelogs'} />
                <Route component={RouteImages} exact path={'/images'} />
                <Route component={RoutePolicy} exact path={'/policy'} />
                <Route
                  component={RouteSettingsEmail}
                  exact
                  path={'/settings/email'}
                />
                <Route
                  component={RouteSettingsPassword}
                  exact
                  path={'/settings/password'}
                />
                <Route component={RouteStats} exact path={'/stats'} />
                <Route component={RouteThreads} exact path={'/threads'} />
                <Route
                  component={RouteThread}
                  exact
                  path={'/threads/:threadId'}
                />
              </Switch>
              <footer />
            </Fragment>
          </BrowserRouter>
          <CssBaseline />
        </AppAuthProvider>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default App
