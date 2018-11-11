import IconButton from '@material-ui/core/IconButton/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Delete from '@material-ui/icons/Delete'
import Favorite from '@material-ui/icons/Favorite'
import Launch from '@material-ui/icons/Launch'
import React from 'react'

const Component = ({
  classes,
  inProgressLike,
  hasLike,
  onClickLike,
  onSelectPost
}) => {
  return (
    <div className={classes.root}>
      <IconButton className={classes.iconButton} disabled>
        <Delete />
      </IconButton>
      <IconButton
        className={classes.iconButton}
        color={hasLike ? 'secondary' : 'default'}
        disabled={inProgressLike}
        onClick={onClickLike}
      >
        <Favorite />
      </IconButton>
      <IconButton className={classes.iconButton} onClick={onSelectPost}>
        <Launch />
      </IconButton>
    </div>
  )
}

const styles = createStyles({
  root: { paddingLeft: 12, paddingRight: 12, paddingBottom: 12 },
  iconButton: { marginRight: 8 }
})

export const PostActions = withStyles(styles)(Component)
