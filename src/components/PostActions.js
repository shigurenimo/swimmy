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

const styles = ({ spacing }) =>
  createStyles({
    root: {
      paddingLeft: spacing.unit * 1.5,
      paddingRight: spacing.unit * 1.5,
      paddingBottom: spacing.unit * 1.5
    },
    iconButton: { marginRight: spacing.unit }
  })

export const PostActions = withStyles(styles)(Component)
