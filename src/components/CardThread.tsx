import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/styles/makeStyles'
import React, { SFC } from 'react'
import { Link } from 'react-router-dom'
import PostCounts from './PostCounts'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'

interface Props {
  post: PostUi
}

const CardThread: SFC<Props> = props => {
  const { post } = props
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
      width: pct(100),
      display: 'grid',
      gridRowGap: px(spacing.unit)
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
