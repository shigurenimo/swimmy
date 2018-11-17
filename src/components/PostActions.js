import IconButton from '@material-ui/core/IconButton/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Delete from '@material-ui/icons/Delete'
import Favorite from '@material-ui/icons/Favorite'
import Launch from '@material-ui/icons/Launch'
import React from 'react'
import { Link } from 'react-router-dom'

const Component = ({
  classes,
  inProgressLike,
  hasLike,
  onClickLike,
  postId
}) => {
  return (
    <div className={classes.root}>
      <IconButton
        className={classes.iconButton}
        disabled
        aria-label={'Delete this post'}
      >
        <Delete />
      </IconButton>
      <IconButton
        className={classes.iconButton}
        color={hasLike ? 'secondary' : 'default'}
        disabled={inProgressLike}
        onClick={onClickLike}
        aria-label={'Add like to this post'}
      >
        <Favorite />
      </IconButton>
      <IconButton
        className={classes.iconButton}
        component={Link}
        to={`/threads/${postId}`}
        aria-label={'Go thread page'}
      >
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
