import CircularProgress from '@material-ui/core/CircularProgress'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component } from 'react'

class AppLoading extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <CircularProgress size={50} />
      </div>
    )
  }
}

const styles = theme => ({
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

export default withStyles(styles)(AppLoading)
