import React, { Fragment, FunctionComponent } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import RouterListener from './containers/RouteListener'
import PageAbout from './pages/PageAbout'
import PageChangelogCreate from './pages/PageChangelogCreate'
import PageChangelogs from './pages/PageChangelogs'
import PageHome from './pages/PageHome'
import PageImages from './pages/PageImages'
import PagePolicy from './pages/PagePolicy'
import PageSearch from './pages/PageSearch'
import PageSettingsEmail from './pages/PageSettingsEmail'
import PageSettingsPassword from './pages/PageSettingsPassword'
import PageStats from './pages/PageStats'
import PageThread from './pages/PageThread'
import PageThreads from './pages/PageThreads'

const AppRouter: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <RouterListener />
        <AppHeader />
        <Switch>
          <Route component={PageHome} exact path="/" />
          <Route component={PageAbout} exact path="/about" />
          <Route component={PageChangelogs} exact path="/changelogs" />
          <Route
            component={PageChangelogCreate}
            exact
            path="/changelogs/create"
          />
          <Route component={PageImages} exact path="/images" />
          <Route component={PagePolicy} exact path="/policy" />
          <Route component={PageSearch} exact path="/search" />
          <Route component={PageSettingsEmail} exact path="/settings/email" />
          <Route
            component={PageSettingsPassword}
            exact
            path="/settings/password"
          />
          <Route component={PageStats} exact path="/stats" />
          <Route component={PageThreads} exact path="/threads" />
          <Route component={PageThread} exact path="/threads/:threadId" />
        </Switch>
        <footer />
      </Fragment>
    </BrowserRouter>
  )
}

export default AppRouter
