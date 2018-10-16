import IconButton from '@material-ui/core/IconButton/IconButton'
import withStyles from '@material-ui/core/styles/withStyles'
import Launch from '@material-ui/icons/Launch'
import Delete from '@material-ui/icons/Delete'
import Favorite from '@material-ui/icons/Favorite'
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
        <IconButton className={classes.iconButton} disabled={true}>
          <Delete />
        </IconButton>
        <IconButton className={classes.iconButton} disabled={true}>
          <Favorite />
        </IconButton>
        <IconButton className={classes.iconButton} onClick={this.onSelectPost}>
          <Launch />
        </IconButton>
      </div>
    )
  }

  onSelectPost = () => {
    const { postId, selectPost } = this.props

    selectPost(postId)
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
