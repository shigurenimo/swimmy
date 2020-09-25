import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MainChangelogs } from './changelog/MainChangelogs'
import { AppBarDefault } from './core/AppBarDefault'
import { BottomNavigationDefault } from './core/BottomNavigationDefault'
import { ListHome } from './home/ListHome'
import { ListOthers } from './home/ListOthers'
import { ListThread } from './home/ListThread'
import { MainHome } from './home/MainHome'
import { MainOthers } from './home/MainOthers'
import { MainThread } from './home/MainThread'
import { LayoutDrawer } from './layout/LayoutDrawer'
import { MicroCMSProvider } from './microcms/MicroCMSProvider'
import { ListPhotos } from './photos/ListPhotos'
import { MainPhotos } from './photos/MainPhotos'
import { ListPrivacy } from './privacy/ListPrivacy'
import { MainPrivacy } from './privacy/MainPrivacy'
import { createTheme } from './theme/createTheme'
import { ListThreads } from './thread/ListThreads'
import { MainThreadArchive } from './thread/MainThreadArchive'
import { MainThreadArchives } from './thread/MainThreadArchives'
import { MainThreads } from './thread/MainThreads'
import { detectStandalone } from './web/detectStandalone'
import { useNight } from './web/useNight'

const App: FunctionComponent = () => {
  const mode = useNight()

  const theme = createTheme(mode)

  const isStandalone = detectStandalone()

  return (
    <MicroCMSProvider
      apiKey={'a21c7b99-9dfd-47df-817c-06168d3a1026'}
      serviceId={'reiwa'}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppBarDefault />
          <LayoutDrawer>
            <Switch>
              <Route exact path={'/'}>
                <ListHome />
              </Route>
              <Route exact path={'/changelogs'}>
                <ListOthers />
              </Route>
              <Route exact path={'/photos'}>
                <ListPhotos />
              </Route>
              <Route exact path={'/others'}>
                <ListOthers />
              </Route>
              <Route exact path={'/privacy'}>
                <ListPrivacy />
              </Route>
              <Route exact path={'/threads'}>
                <ListThreads />
              </Route>
              <Route exact path={'/archives'}>
                <ListThreads />
              </Route>
              <Route exact path={'/archives/:year/:month'}>
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
            <Route exact path={'/changelogs'}>
              <MainChangelogs />
            </Route>
            <Route exact path={'/photos'}>
              <MainPhotos />
            </Route>
            <Route exact path={'/others'}>
              <MainOthers />
            </Route>
            <Route exact path={'/privacy'}>
              <MainPrivacy />
            </Route>
            <Route exact path={'/threads'}>
              <MainThreads />
            </Route>
            <Route exact path={'/archives'}>
              <MainThreadArchives />
            </Route>
            <Route exact path={'/archives/:year/:month'}>
              <MainThreadArchive />
            </Route>
            <Route exact path={'/threads/:threadId'}>
              <MainThread />
            </Route>
          </Switch>
          {isStandalone && <BottomNavigationDefault />}
        </BrowserRouter>
        <CssBaseline />
      </ThemeProvider>
    </MicroCMSProvider>
  )
}

export default App
