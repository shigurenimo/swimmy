import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import Favorite from '@material-ui/icons/Favorite'
import Launch from '@material-ui/icons/Launch'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  inProgressLike: boolean
  hasLike: boolean
  onClickLike: any
  postId: string
}

const PostActions: FunctionComponent<Props> = ({
  inProgressLike,
  hasLike,
  onClickLike,
  postId
}) => {
  const classes = useStyles({})
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
        component={() => <Link to={`/threads/${postId}`} />}
        aria-label={'Go thread page'}
      >
        <Launch />
      </IconButton>
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    iconButton: { marginRight: spacing.unit },
    root: {
      paddingBottom: spacing.unit * 1.5,
      paddingLeft: spacing.unit * 1.5,
      paddingRight: spacing.unit * 1.5
    }
  }
})

export default PostActions
