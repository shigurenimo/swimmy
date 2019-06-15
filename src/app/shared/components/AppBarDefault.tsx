import {
  AppBar,
  IconButton,
  LinearProgress,
  Theme,
  Toolbar
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import PhotoIcon from '@material-ui/icons/Photo'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import WhatshotIcon from '@material-ui/icons/Whatshot'
import { makeStyles } from '@material-ui/styles'
import DialogMenu from 'app/core/DialogMenu'
import { useAuthLoading } from 'app/shared/auth/useAuthLoading'
import { useAuthUser } from 'app/shared/auth/useAuthUser'
import DialogSignIn from 'app/shared/components/DialogSignIn'
import ImgLogo from 'app/shared/components/ImgLogo'
import { pct } from 'app/shared/styles/pct'
import { px } from 'app/shared/styles/px'
import React, { Fragment, FunctionComponent, useState } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

type Props = RouteComponentProps & { isClose?: boolean }

const AppBarDefault: FunctionComponent<Props> = ({ history, isClose }) => {
  const [authUser] = useAuthUser()

  const [authLoading] = useAuthLoading()

  const [isOpenSignInDialog, setIsOpenSignInDialog] = useState(false)

  const [isOpenMenuDialog, setIsOpenMenuDialog] = useState(false)

  const classes = useStyle({})

  return (
    <Fragment>
      <AppBar position={'sticky'} className={classes.appBar}>
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
                onClick={() => setIsOpenMenuDialog(true)}
                aria-label={'Open a menu'}
              >
                <MoreHorizIcon />
              </IconButton>
              {!authLoading && authUser !== null && (
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

const useStyle = makeStyles<Theme>(({ spacing }) => {
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

export default withRouter(AppBarDefault)
