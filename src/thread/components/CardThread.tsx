import { Card, CardContent, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import DivPostCounts from '../../components/DivPostCounts'
import { Post } from '../../firestore/types/post'
import { toDateText } from '../../text/toDateText'
import { px } from '../../styles/px'

type Props = { post: Post }

const CardThread: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles({})

  return (
    <Link to={`/threads/${post.id}`}>
      <Card>
        <CardContent className={classes.root}>
          <DivPostCounts
            replyPostCount={post.replyPostCount}
            likeCount={post.likeCount}
          />
          <Typography className={classes.text} variant={'body2'}>
            {post.text}
          </Typography>
          <Typography color={'textSecondary'} variant={'caption'}>
            {toDateText(post.createdAt)}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  )
}

const useStyles = makeStyles<Theme>(({ typography, palette, spacing }) => {
  return {
    root: {
      display: 'grid',
      gridRowGap: px(spacing(1)),
      width: `${100}%`
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
