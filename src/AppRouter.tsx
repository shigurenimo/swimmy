import React, {
  Component,
  ComponentClass,
  Fragment,
  FunctionComponent
} from 'react'
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
          <Route exact path="/" component={PageHome as any} />
          <Route exact path="/about" component={PageAbout as any} />
          <Route exact path="/changelogs" component={PageChangelogs as any} />
          <Route
            component={PageChangelogCreate as any}
            exact
            path="/changelogs/create"
          />
          <Route exact path="/images" component={PageImages as any} />
          <Route exact path="/policy" component={PagePolicy as any} />
          <Route exact path="/search" component={PageSearch as any} />
          <Route
            exact
            path="/settings/email"
            component={PageSettingsEmail as any}
          />
          <Route
            component={PageSettingsPassword as any}
            exact
            path="/settings/password"
          />
          <Route exact path="/stats" component={PageStats as any} />
          <Route exact path="/threads" component={PageThreads as any} />
          <Route
            exact
            path="/threads/:threadId"
            component={PageThread as any}
          />
        </Switch>
        <footer />
      </Fragment>
    </BrowserRouter>
  )
}

export default AppRouter
