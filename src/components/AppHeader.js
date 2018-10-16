import AppBar from '@material-ui/core/AppBar/AppBar'
import IconButton from '@material-ui/core/IconButton/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import withStyles from '@material-ui/core/styles/withStyles'
import Toolbar from '@material-ui/core/Toolbar/Toolbar'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import Photo from '@material-ui/icons/Photo'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import TurnedIn from '@material-ui/icons/TurnedIn'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import AppMenuDialog from '../containers/AppMenuDialog'
import AppSignInDialog from '../containers/AppSignInDialog'
import { AuthConsumer } from '../contexts/auth'
import AppTitle from './AppTitle'

class AppHeader extends Component {
  state = {
    isOpenSignInDialog: false,
    isOpenMenuDialog: false
  }

  render() {
    const { classes } = this.props
    const { isOpenSignInDialog, isOpenMenuDialog } = this.state

    return (
      <Fragment>
        <AppBar position="sticky" color="default" className={classes.appBar}>
          <AuthConsumer>
            {auth =>
              auth.isLoggingIn && (
                <LinearProgress className={classes.progress} />
              )
            }
          </AuthConsumer>
          <Toolbar>
            <AppTitle />
            <Link to={'/images'}>
              <IconButton>
                <Photo />
              </IconButton>
            </Link>
            <Link to={'/threads'}>
              <IconButton>
                <TurnedIn />
              </IconButton>
            </Link>
            <IconButton onClick={this.onOpenMenuDialog}>
              <MoreHoriz />
            </IconButton>
            <AuthConsumer>
              {auth => {
                if (auth.isLoggingIn) {
                  return null
                }
                return (
                  !auth.isLogged && (
                    <IconButton onClick={this.onOpenSignInDialog}>
                      <PowerSettingsNew />
                    </IconButton>
                  )
                )
              }}
            </AuthConsumer>
          </Toolbar>
        </AppBar>
        <AppMenuDialog
          isOpen={isOpenMenuDialog}
          onClose={this.onCloseMenuDialog}
        />
        <AppSignInDialog
          isOpen={isOpenSignInDialog}
          closeDialog={this.closeDialog}
        />
      </Fragment>
    )
  }

  onOpenMenuDialog = () => {
    this.setState({ isOpenMenuDialog: true })
  }

  onOpenSignInDialog = () => {
    this.setState({ isOpenSignInDialog: true })
  }

  onCloseMenuDialog = () => {
    this.setState({ isOpenMenuDialog: false })
  }

  closeDialog = () => {
    this.setState({ isOpenSignInDialog: false })
  }
}

const styles = () => ({
  root: {
    flexGrow: 1
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  },
  title: {
    fontSize: 24,
    flexGrow: 1
  },
  appBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})

export default compose(
  withRouter,
  withStyles(styles)
)(AppHeader)
