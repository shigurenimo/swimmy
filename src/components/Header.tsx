import { AppBar, IconButton, LinearProgress, Toolbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import PhotoIcon from '@material-ui/icons/Photo'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import WhatshotIcon from '@material-ui/icons/Whatshot'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent, useContext, useState } from 'react'
import Headroom from 'react-headroom'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { AuthContext } from '../contexts/authContext'
import { pct } from '../libs/pct'
import { px } from '../libs/px'
import DialogMenu from './DialogMenu'
import DialogSignIn from './DialogSignIn'
import ImgLogo from './ImgLogo'

type Props = RouteComponentProps & {
  isClose?: boolean
}

const Header: FunctionComponent<Props> = ({ history, isClose }) => {
  const authContext = useContext(AuthContext)
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

  return (
    <Fragment>
      <Headroom disableInlineStyles={true}>
        <AppBar position={'static'} className={classes.appBar}>
          {authContext.isLoggingIn && (
            <LinearProgress className={classes.progress} />
          )}
          <Toolbar>
            <ImgLogo />
            {isClose && (
              <IconButton onClick={onGoBack} aria-label={'Close this page'}>
                <CloseIcon />
              </IconButton>
            )}
            {!isClose && (
              <div className={classes.actions}>
                <Link to={'/images'}>
                  <IconButton aria-label={'Open images page'}>
                    <PhotoIcon />
                  </IconButton>
                </Link>
                <Link to={'/threads'}>
                  <IconButton aria-label={'Open threads page'}>
                    <WhatshotIcon />
                  </IconButton>
                </Link>
                <IconButton
                  onClick={onOpenMenuDialog}
                  aria-label={'Open a menu'}
                >
                  <MoreHorizIcon />
                </IconButton>
                {!authContext.isLoggingIn && !authContext.isLogged && (
                  <IconButton
                    onClick={onOpenSignInDialog}
                    aria-label={'Open a login dialog'}
                  >
                    <PowerSettingsNewIcon />
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
