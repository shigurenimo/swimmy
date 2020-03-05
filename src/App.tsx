import { CssBaseline } from '@material-ui/core'
import { StylesProvider, ThemeProvider } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AppBarDefault from './core/AppBarDefault'
import BottomNavigationDefault from './core/BottomNavigationDefault'
import ListHome from './home/ListHome'
import ListOthers from './home/ListOthers'
import ListThread from './home/ListThread'
import MainHome from './home/MainHome'
import MainOthers from './home/MainOthers'
import MainThread from './home/MainThread'
import ListImages from './image/ListImages'
import MainImages from './image/MainImages'
import LayoutDrawer from './layout/LayoutDrawer'
import ListPrivacy from './privacy/ListPrivacy'
import MainPrivacy from './privacy/MainPrivacy'
import ListSearch from './search/ListSearch'
import MainSearch from './search/MainSearch'
import { createTheme } from './theme/createTheme'
import ListThreads from './thread/ListThreads'
import MainThreads from './thread/MainThreads'
import MainThreadsNext from './thread/MainThreadsNext'
import { detectStandalone } from './web/detectStandalone'
import { useNight } from './web/useNight'

const App: FunctionComponent = () => {
  const [dark] = useNight()

  const theme = createTheme({ dark })

  const isStandalone = detectStandalone()

  return (
    <StylesProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppBarDefault />
          <LayoutDrawer>
            <Switch>
              <Route exact path={'/'}>
                <ListHome />
              </Route>
              <Route exact path={'/images'}>
                <ListImages />
              </Route>
              <Route exact path={'/others'}>
                <ListOthers />
              </Route>
              <Route exact path={'/privacy'}>
                <ListPrivacy />
              </Route>
              <Route exact path={'/search'}>
                <ListSearch />
              </Route>
              <Route exact path={'/threads'}>
                <ListThreads />
              </Route>
              <Route exact path={'/threads/next'}>
                <ListOthers />
              </Route>
              <Route exact path={'/threads/:threadId'}>
                <ListThread />
              </Route>
            </Switch>
          </LayoutDrawer>
          <Switch>
            <Route exact path={'/'}>
              <MainHome />
            </Route>
            <Route exact path={'/images'}>
              <MainImages />
            </Route>
            <Route exact path={'/others'}>
              <MainOthers />
            </Route>
            <Route exact path={'/privacy'}>
              <MainPrivacy />
            </Route>
            <Route exact path={'/search'}>
              <MainSearch />
            </Route>
            <Route exact path={'/threads'}>
              <MainThreads />
            </Route>
            <Route exact path={'/threads/next'}>
              <MainThreadsNext />
            </Route>
            <Route exact path={'/threads/:threadId'}>
              <MainThread />
            </Route>
          </Switch>
          {isStandalone && <BottomNavigationDefault />}
        </BrowserRouter>
        <CssBaseline />
      </ThemeProvider>
    </StylesProvider>
  )
}

export default App
