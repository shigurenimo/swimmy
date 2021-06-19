import { Drawer, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

export const LayoutDrawer: FunctionComponent = ({ children }) => {
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

const useStyles = makeStyles<Theme>((theme) => {
  return {
    drawerPaper: {
      height: '100%',
      position: 'fixed',
      width: theme.spacing(60),
      zIndex: 1300 - 1,
    },
    root: { [theme.breakpoints.down('sm')]: { display: 'none' } },
  }
})
