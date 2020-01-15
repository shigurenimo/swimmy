import { AppBar, IconButton, Theme, Toolbar, useTheme } from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useColumns } from '../hooks/useColumns'
import DialogMenu from './DialogMenu'
import ImgLogo from './ImgLogo'

const AppBarDefault: FunctionComponent = () => {
  const { spacing } = useTheme()

  const columns = useColumns()

  const [openDialog, setOpenDialog] = useState(false)

  const classes = useStyles()

  return (
    <Fragment>
      <AppBar
        color={'inherit'}
        position={'fixed'}
        className={classes.appBar}
        style={{ paddingLeft: columns ? spacing(50) : 0 }}
      >
        <Toolbar>
          <ImgLogo />
          <div className={classes.actions}>
            <Link to={'/threads'}>
              <IconButton aria-label={'Open threads page'}>
                <ChatBubbleIcon />
              </IconButton>
            </Link>
            <IconButton
              onClick={() => setOpenDialog(true)}
              aria-label={'Open a menu'}
            >
              <MoreHorizIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <DialogMenu open={openDialog} onClose={() => setOpenDialog(false)} />
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing, zIndex }) => {
  return {
    actions: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: spacing(1),
    },
    appBar: {
      paddingTop: 'env(safe-area-inset-top)',
      zIndex: zIndex.drawer + 1,
    },
  }
})

export default AppBarDefault
