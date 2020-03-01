import { analytics } from 'firebase/app'
import React, { FunctionComponent, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import RouteAbout from './about/RouteAbout'
import RouteChangelogs from './changelog/RouteChangelogs'
import RouteHomeIndex from './home/RouteHomeIndex'
import RouteImages from './image/RouteImages'
import RoutePolicy from './policy/RoutePolicy'
import RouteStats from './stat/RouteStats'
import RouteThreads from './thread/RouteThreads'

const SwitchApp: FunctionComponent = () => {
  const location = useLocation()

  useEffect(() => {
    analytics().setCurrentScreen(location.pathname)
  }, [location.pathname])

  return (
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
  )
}

export default SwitchApp
