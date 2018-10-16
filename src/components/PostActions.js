import IconButton from '@material-ui/core/IconButton/IconButton'
import withStyles from '@material-ui/core/styles/withStyles'
import Delete from '@material-ui/icons/Delete'
import Favorite from '@material-ui/icons/Favorite'
import Launch from '@material-ui/icons/Launch'
import React, { Component } from 'react'

class PostActions extends Component {
  render() {
    const { classes, inProgressLike, hasLike } = this.props

    return (
      <div className={classes.root}>
        <IconButton className={classes.iconButton} disabled={true}>
          <Delete />
        </IconButton>
        <IconButton
          className={classes.iconButton}
          onClick={this.onClickLike}
          disabled={inProgressLike}
          color={hasLike ? 'secondary' : 'default'}
        >
          <Favorite />
        </IconButton>
        <IconButton className={classes.iconButton} onClick={this.onSelectPost}>
          <Launch />
        </IconButton>
      </div>
    )
  }

  onClickLike = () => {
    const { postId, onClickLike } = this.props

    onClickLike(postId)
  }

  onSelectPost = () => {
    const { postId, selectPost } = this.props

    selectPost(postId)
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
