import IconButton from '@material-ui/core/IconButton/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
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

export const ThreadActions = withStyles(styles)(Component)
