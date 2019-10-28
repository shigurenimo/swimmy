import { CssBaseline } from '@material-ui/core'
import { StylesProvider, ThemeProvider } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import RouteAbout from './about/RouteAbout'
import RouteChangelogs from './changelog/RouteChangelogs'
import FragmentListener from './components/FragmentListener'
import { useDark } from './dark/useDark'
import RouteHomeIndex from './home/RouteHomeIndex'
import RouteImages from './image/RouteImages'
import RoutePolicy from './policy/RoutePolicy'
import RouteSettingsEmail from './setting/RouteSettingsEmail'
import RouteSettingsPassword from './setting/RouteSettingsPassword'
import RouteStats from './stat/RouteStats'
import { createTheme } from './theme/createTheme'
import RouteThreads from './thread/RouteThreads'

const App: FunctionComponent = () => {
  const dark = useDark()

  const theme = createTheme({ dark })

  return (
    <StylesProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Fragment>
            <FragmentListener />
            <Switch>
              <Route exact path={'/'}>
                <RouteHomeIndex />
              </Route>
              <Route exact path={'/about'}>
                <RouteAbout />
              </Route>
              <Route exact path={'/changelogs'}>
                <RouteChangelogs />
              </Route>
              <Route exact path={'/images'}>
                <RouteImages />
              </Route>
              <Route exact path={'/policy'}>
                <RoutePolicy />
              </Route>
              <Route exact path={'/settings/email'}>
                <RouteSettingsEmail />
              </Route>
              <Route exact path={'/settings/password'}>
                <RouteSettingsPassword />
              </Route>
              <Route exact path={'/stats'}>
                <RouteStats />
              </Route>
              <Route exact path={'/threads'}>
                <RouteThreads />
              </Route>
              <Route exact path={'/threads/:threadId'}>
                <RouteHomeIndex />
              </Route>
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
