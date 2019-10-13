import { CssBaseline } from '@material-ui/core'
import { StylesProvider, ThemeProvider } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import { Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import RouteAbout from './about/RouteAbout'
import RouteChangelogs from './changelog/RouteChangelogs'
import RouteHomeIndex from './home/RouteHomeIndex'
import RouteImages from './image/RouteImages'
import RoutePolicy from './policy/RoutePolicy'
import RouteSettingsEmail from './setting/RouteSettingsEmail'
import RouteSettingsPassword from './setting/RouteSettingsPassword'
import FragmentListener from './components/FragmentListener'
import { createTheme } from './helpers/createTheme'
import RouteStats from './stat/RouteStats'
import RouteThreads from './thread/RouteThreads'

const theme = createTheme()

const App: FunctionComponent = () => {
  return (
    <StylesProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Fragment>
            <FragmentListener />
            <Switch>
              <Route component={RouteHomeIndex} exact path={'/'} />
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
                component={RouteHomeIndex}
                exact
                path={'/threads/:threadId'}
              />
            </Switch>
            <footer />
          </Fragment>
        </BrowserRouter>
        <CssBaseline />
      </ThemeProvider>
    </StylesProvider>
  )
}

export default App
