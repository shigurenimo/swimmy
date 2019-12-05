import {
  AppBar,
  IconButton,
  LinearProgress,
  Theme,
  Toolbar,
  useTheme,
} from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthLoading } from '../auth/useAuthLoading'
import { useColumns } from '../hooks/useColumns'
import { pct } from '../styles/pct'
import { px } from '../styles/px'
import DialogMenu from './DialogMenu'
import ImgLogo from './ImgLogo'

const AppBarDefault: FunctionComponent = () => {
  const { spacing } = useTheme()

  const columns = useColumns()

  const [authLoading] = useAuthLoading()

  const [isOpenMenuDialog, setIsOpenMenuDialog] = useState(false)

  const classes = useStyle({})

  return (
    <Fragment>
      <AppBar
        color={'inherit'}
        position={'fixed'}
        className={classes.appBar}
        style={{ paddingLeft: columns ? spacing(50) : 0 }}
      >
        {authLoading && <LinearProgress className={classes.progress} />}
        <Toolbar>
          <ImgLogo />
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
          </div>
        </Toolbar>
      </AppBar>
      <DialogMenu
        isOpen={isOpenMenuDialog}
        onClose={() => setIsOpenMenuDialog(false)}
      />
    </Fragment>
  )
}

const useStyle = makeStyles<Theme>(({ breakpoints, spacing, zIndex }) => {
  return {
    actions: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: px(spacing(1)),
    },
    appBar: {
      paddingTop: 'env(safe-area-inset-top)',
      zIndex: zIndex.drawer + 1,
    },
    progress: { position: 'absolute', top: 0, left: 0, width: pct(100) },
  }
})

export default AppBarDefault
