import { Drawer, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

const LayoutDrawer: FunctionComponent = ({ children }) => {
  const classes = useStyles()

  return (
    <Drawer
      classes={{ paper: classes.drawerPaper }}
      className={classes.root}
      open={true}
      PaperProps={{ elevation: 1 }}
      variant={'persistent'}
    >
      {children}
    </Drawer>
  )
}

const useStyles = makeStyles<Theme>(({ breakpoints, shadows, spacing }) => {
  return {
    drawerPaper: {
      height: '100%',
      position: 'fixed',
      width: spacing(40),
      zIndex: 1300 - 1,
    },
    root: { [breakpoints.down('sm')]: { display: 'none' } },
  }
})

export default LayoutDrawer
