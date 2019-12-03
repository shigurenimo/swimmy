import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import RouteAbout from './about/RouteAbout'
import { useAnalytics } from './analytics/useAnalytics'
import RouteChangelogs from './changelog/RouteChangelogs'
import RouteHomeIndex from './home/RouteHomeIndex'
import RouteImages from './image/RouteImages'
import RoutePolicy from './policy/RoutePolicy'
import RouteSettingsEmail from './setting/RouteSettingsEmail'
import RouteSettingsPassword from './setting/RouteSettingsPassword'
import RouteStats from './stat/RouteStats'
import RouteThreads from './thread/RouteThreads'

const SwitchApp: FunctionComponent = () => {
  useAnalytics()

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
  )
}

export default SwitchApp
