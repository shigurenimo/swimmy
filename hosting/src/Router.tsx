import React, { FunctionComponent } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { BottomNavigationDefault } from 'src/core/components/BottomNavigationDefault'
import { HeaderHome } from 'src/core/components/HeaderHome'
import { LayoutDrawer } from 'src/core/components/LayoutDrawer'
import { detectStandalone } from 'src/core/utils/detectStandalone'
import { ListHome } from 'src/home/ListHome'
import { ListOthers } from 'src/home/ListOthers'
import { ListThread } from 'src/home/ListThread'
import { MainHome } from 'src/home/MainHome'
import { MainOthers } from 'src/home/MainOthers'
import { MainThread } from 'src/home/MainThread'
import { ListPhotos } from 'src/photo/ListPhotos'
import { MainPhotos } from 'src/photo/MainPhotos'
import { ListPrivacy } from 'src/privacy/ListPrivacy'
import { MainPrivacy } from 'src/privacy/MainPrivacy'
import { ListThreads } from 'src/thread/ListThreads'
import { MainThreads } from 'src/thread/MainThreads'

export const Router: FunctionComponent = () => {
  const isStandalone = detectStandalone()

  return (
    <BrowserRouter>
      <HeaderHome />
      <LayoutDrawer>
        <Switch>
          <Route exact path={'/'}>
            <ListHome />
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
          <Route exact path={'/threads/:threadId'}>
            <ListThread />
          </Route>
        </Switch>
      </LayoutDrawer>
      <Switch>
        <Route exact path={'/'}>
          <MainHome />
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
        <Route exact path={'/threads/:threadId'}>
          <MainThread />
        </Route>
      </Switch>
      {isStandalone && <BottomNavigationDefault />}
    </BrowserRouter>
  )
}
