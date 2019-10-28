import {
  AppBar,
  IconButton,
  LinearProgress,
  Theme,
  Toolbar
} from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import CloseIcon from '@material-ui/icons/Close'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAuthLoading } from '../auth/useAuthLoading'
import { useAuthUser } from '../auth/useAuthUser'
import { pct } from '../styles/pct'
import { px } from '../styles/px'
import DialogMenu from './DialogMenu'
import DialogSignIn from './DialogSignIn'
import ImgLogo from './ImgLogo'

type Props = { isClose?: boolean }

const AppBarDefault: FunctionComponent<Props> = ({ isClose }) => {
  const history = useHistory()

  const [authUser] = useAuthUser()

  const [authLoading] = useAuthLoading()

  const [isOpenSignInDialog, setIsOpenSignInDialog] = useState(false)

  const [isOpenMenuDialog, setIsOpenMenuDialog] = useState(false)

  const classes = useStyle({})

  return (
    <Fragment>
      <AppBar color={'inherit'} position={'sticky'} className={classes.appBar}>
        {authLoading && <LinearProgress className={classes.progress} />}
        <Toolbar>
          <ImgLogo />
          {isClose && (
            <IconButton
              onClick={() => history.goBack()}
              aria-label={'Close this page'}
            >
              <CloseIcon />
            </IconButton>
          )}
          {!isClose && (
            <div className={classes.actions}>
              <Link to={'/threads'}>
                <IconButton aria-label={'Open threads page'}>
                  <ChatBubbleIcon />
                </IconButton>
              </Link>
              <IconButton
                onClick={() => setIsOpenMenuDialog(true)}
                aria-label={'Open a menu'}
              >
                <MoreHorizIcon />
              </IconButton>
              {!authLoading && authUser === null && (
                <IconButton
                  onClick={() => setIsOpenSignInDialog(true)}
                  aria-label={'Open a login dialog'}
                >
                  <PowerSettingsNewIcon />
                </IconButton>
              )}
            </div>
          )}
        </Toolbar>
      </AppBar>
      <DialogMenu
        isOpen={isOpenMenuDialog}
        onClose={() => setIsOpenMenuDialog(false)}
      />
      <DialogSignIn
        isOpen={isOpenSignInDialog}
        closeDialog={() => setIsOpenSignInDialog(false)}
      />
    </Fragment>
  )
}

const useStyle = makeStyles<Theme>(({ spacing, zIndex }) => {
  return {
    actions: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: px(spacing(1))
    },
    appBar: {
      // backgroundColor: 'rgba(255, 255, 255, 0.98)',
      zIndex: zIndex.drawer + 1
    },
    menuButton: { marginLeft: spacing(-1.5), marginRight: spacing(2.5) },
    progress: { position: 'absolute', top: 0, left: 0, width: pct(100) },
    title: { fontSize: 24, flexGrow: 1 }
  }
})

export default AppBarDefault
