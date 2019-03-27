import React, { Fragment, FunctionComponent } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AppHeader from '../components/Header'
import RouteAbout from './RouteAbout'
import RouteChangelogs from './RouteChangelogs'
import RouteHome from './RouteHome'
import RouteImages from './RouteImages'
import RouterListener from './RouteListener'
import RoutePolicy from './RoutePolicy'
import RouteSettingsEmail from './RouteSettingsEmail'
import RouteSettingsPassword from './RouteSettingsPassword'
import RouteStats from './RouteStats'
import RouteThread from './RouteThread'
import RouteThreads from './RouteThreads'

const RouteIndex: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <RouterListener />
        <AppHeader />
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
          <Route component={RouteThread} exact path={'/threads/:threadId'} />
        </Switch>
        <footer />
      </Fragment>
    </BrowserRouter>
  )
}

export default RouteIndex
