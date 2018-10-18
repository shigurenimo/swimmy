import IconButton from '@material-ui/core/IconButton/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Delete from '@material-ui/icons/Delete'
import Favorite from '@material-ui/icons/Favorite'
import Launch from '@material-ui/icons/Launch'
import React from 'react'

const PostActions = ({
  classes,
  inProgressLike,
  hasLike,
  onClickLike,
  onSelectPost
}) => (
  <div className={classes.root}>
    <IconButton className={classes.iconButton} disabled>
      <Delete />
    </IconButton>
    <IconButton
      className={classes.iconButton}
      onClick={onClickLike}
      disabled={inProgressLike}
      color={hasLike ? 'secondary' : 'default'}
    >
      <Favorite />
    </IconButton>
    <IconButton className={classes.iconButton} onClick={onSelectPost}>
      <Launch />
    </IconButton>
  </div>
)

const styles = createStyles({
  root: {
    paddingLeft: 12,
    paddingRight: 12
  },
  iconButton: {
    marginRight: 8
  }
})

export default withStyles(styles)(PostActions)
