import withStyles from '@material-ui/core/styles/withStyles'
import React, { Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AppHeader } from './containers/AppHeader'
import { PageAbout } from './pages/PageAbout'
import { PageChangelogs } from './pages/PageChangelogs'
import { PageDevelopment } from './pages/PageDevelopment'
import { PageHome } from './pages/PageHome'
import { PageImages } from './pages/PageImages'
import { PageIssues } from './pages/PageIssues'
import { PageSearch } from './pages/PageSearch'
import { PageSettingsEmail } from './pages/PageSettingsEmail'
import { PageSettingsPassword } from './pages/PageSettingsPassword'
import { PageStats } from './pages/PageStats'
import { PageThreads } from './pages/PageThreads'

class Component extends React.Component<any, any> {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <AppHeader />
          <Switch>
            <Route exact path="/" component={PageHome} />
            <Route path="/about" component={PageAbout} />
            <Route path="/changelogs" component={PageChangelogs} />
            <Route path="/development" component={PageDevelopment} />
            <Route path="/images" component={PageImages} />
            <Route path="/issues" component={PageIssues} />
            <Route path="/search" component={PageSearch} />
            <Route path="/settings/email" component={PageSettingsEmail} />
            <Route path="/settings/password" component={PageSettingsPassword} />
            <Route path="/stats" component={PageStats} />
            <Route path="/threads" component={PageThreads} />
          </Switch>
        </Fragment>
      </BrowserRouter>
    )
  }
}

const styles = () => ({})

export const AppRouter = withStyles(styles)(Component)
