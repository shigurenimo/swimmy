import { AppBar, IconButton, LinearProgress, Toolbar } from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import Photo from '@material-ui/icons/Photo'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import TurnedIn from '@material-ui/icons/TurnedIn'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent, useContext, useState } from 'react'
import Headroom from 'react-headroom'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { AuthContext } from '../contexts/authContext'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'
import DialogMenu from './DialogMenu'
import DialogSignIn from './DialogSignIn'
import ImgLogo from './ImgLogo'

type Props = RouteComponentProps

const Header: FunctionComponent<Props> = ({ history }) => {
  const [isOpenSignInDialog, setIsOpenSignInDialog] = useState(false)
  const [isOpenMenuDialog, setIsOpenMenuDialog] = useState(false)
  const onOpenMenuDialog = () => {
    setIsOpenMenuDialog(true)
  }
  const onOpenSignInDialog = () => {
    setIsOpenSignInDialog(true)
  }
  const onCloseMenuDialog = () => {
    setIsOpenMenuDialog(false)
  }
  const closeDialog = () => {
    setIsOpenSignInDialog(false)
  }
  const onGoBack = () => {
    history.goBack()
  }
  const classes = useStyle({})
  const isDetailPage = location.pathname.includes('/threads/')
  const authContext = useContext(AuthContext)

  return (
    <Fragment>
      <Headroom disableInlineStyles={true}>
        <AppBar position={'static'} className={classes.appBar}>
          {authContext.isLoggingIn && (
            <LinearProgress className={classes.progress} />
          )}
          <Toolbar>
            <ImgLogo />
            {isDetailPage && (
              <IconButton onClick={onGoBack} aria-label={'Close this page'}>
                <Close />
              </IconButton>
            )}
            {!isDetailPage && (
              <div className={classes.actions}>
                <Link to={'/images'}>
                  <IconButton aria-label={'Open images page'}>
                    <Photo />
                  </IconButton>
                </Link>
                <Link to={'/threads'}>
                  <IconButton aria-label={'Open threads page'}>
                    <TurnedIn />
                  </IconButton>
                </Link>
                <IconButton
                  onClick={onOpenMenuDialog}
                  aria-label={'Open a menu'}
                >
                  <MoreHoriz />
                </IconButton>
                {!authContext.isLoggingIn && !authContext.isLogged && (
                  <IconButton
                    onClick={onOpenSignInDialog}
                    aria-label={'Open a login dialog'}
                  >
                    <PowerSettingsNew />
                  </IconButton>
                )}
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Headroom>
      <DialogMenu isOpen={isOpenMenuDialog} onClose={onCloseMenuDialog} />
      <DialogSignIn isOpen={isOpenSignInDialog} closeDialog={closeDialog} />
    </Fragment>
  )
}

const useStyle = makeStyles(({ spacing }) => {
  return {
    actions: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: px(spacing(1))
    },
    appBar: { backgroundColor: 'rgba(255, 255, 255, 0.98)' },
    menuButton: { marginLeft: spacing(-1.5), marginRight: spacing(2.5) },
    progress: { position: 'absolute', top: 0, left: 0, width: pct(100) },
    root: { flexGrow: 1 },
    title: { fontSize: 24, flexGrow: 1 }
  }
})

export default withRouter(Header)
