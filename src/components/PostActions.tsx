import { IconButton } from '@material-ui/core'
import Favorite from '@material-ui/icons/Favorite'
import Launch from '@material-ui/icons/Launch'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

type Props = {
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
        color={hasLike ? 'secondary' : 'default'}
        disabled={inProgressLike}
        onClick={onClickLike}
        aria-label={'Add like to this post'}
      >
        <Favorite />
      </IconButton>
      <Link to={`/threads/${postId}`}>
        <IconButton
          className={classes.iconButton}
          aria-label={'Go thread page'}
        >
          <Launch />
        </IconButton>
      </Link>
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    iconButton: { marginRight: spacing(1) },
    root: {
      paddingBottom: spacing(1.5),
      paddingLeft: spacing(1.5),
      paddingRight: spacing(1.5)
    }
  }
})

export default PostActions
