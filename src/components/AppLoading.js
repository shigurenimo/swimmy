import CircularProgress from '@material-ui/core/CircularProgress'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'

const Component = ({ classes }) => (
  <div className={classes.root}>
    <CircularProgress size={50} />
  </div>
)

const styles = createStyles({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    zIndex: -1
  }
})

export const AppLoading = withStyles(styles)(Component)
