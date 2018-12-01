import React, { Fragment, SFC } from 'react'
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

const AppRouter: SFC = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <RouterListener />
        <AppHeader />
        <Switch>
          <Route exact path="/" component={PageHome} />
          <Route exact path="/about" component={PageAbout} />
          <Route exact path="/changelogs" component={PageChangelogs} />
          <Route
            exact
            path="/changelogs/create"
            component={PageChangelogCreate}
          />
          <Route exact path="/images" component={PageImages} />
          <Route exact path="/policy" component={PagePolicy} />
          <Route exact path="/search" component={PageSearch} />
          <Route exact path="/settings/email" component={PageSettingsEmail} />
          <Route
            exact
            path="/settings/password"
            component={PageSettingsPassword}
          />
          <Route exact path="/stats" component={PageStats} />
          <Route exact path="/threads" component={PageThreads} />
          <Route exact path="/threads/:threadId" component={PageThread} />
        </Switch>
        <footer />
      </Fragment>
    </BrowserRouter>
  )
}

export default AppRouter
