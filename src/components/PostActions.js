import IconButton from '@material-ui/core/IconButton/IconButton'
import withStyles from '@material-ui/core/styles/withStyles'
import Favorite from '@material-ui/icons/Favorite'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import React, { Component } from 'react'

class PostActions extends Component {
  isUnmounted = false

  state = {
    inProgress: false
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <IconButton className={classes.iconButton}>
          <MoreHoriz />
        </IconButton>
        <IconButton className={classes.iconButton}>
          <Favorite />
        </IconButton>
      </div>
    )
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }
}

const styles = () => ({
  root: {
    paddingLeft: 12,
    paddingRight: 12
  },
  iconButton: {
    marginRight: 8
  }
})

export default withStyles(styles)(PostActions)
