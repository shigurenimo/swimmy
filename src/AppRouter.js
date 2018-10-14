import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component, Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import PageAbout from './pages/PageAbout'
import PageDevelopment from './pages/PageDevelopment'
import PageHome from './pages/PageHome'
import PageImages from './pages/PageImages'
import PageSearch from './pages/PageSearch'
import PageSettingsEmail from './pages/PageSettingsEmail'
import PageSettingsPassword from './pages/PageSettingsPassword'
import PageStats from './pages/PageStats'
import PageThreads from './pages/PageThreads'

class AppRouter extends Component<any, any> {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <AppHeader />
          <Switch>
            <Route exact path="/" component={PageHome} />
            <Route path="/about" component={PageAbout} />
            <Route path="/development" component={PageDevelopment} />
            <Route path="/images" component={PageImages} />
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

export default withStyles(styles)(AppRouter)
