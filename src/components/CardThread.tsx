import { Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { PostUi } from '../interfaces/models/postUi'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'
import PostCounts from './PostCounts'

type Props = {
  post: PostUi
}

const CardThread: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles({})

  return (
    <Link to={`/threads/${post.id}`}>
      <Card>
        <CardContent className={classes.root}>
          <PostCounts
            replyPostCount={post.replyPostCount}
            likeCount={post.likeCount}
          />
          <Typography className={classes.text} variant={'body2'}>
            {post.text}
          </Typography>
          <Typography color={'textSecondary'} variant={'caption'}>
            {post.ui.createdAt}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  )
}

const useStyles = makeStyles(({ typography, palette, spacing }) => {
  return {
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit),
      width: pct(100)
    },
    text: {
      fontSize: typography.pxToRem(16),
      fontWeight: typography.fontWeightMedium,
      whiteSpace: 'pre-line',
      wordBreak: 'break-all'
    }
  }
})

export default CardThread
