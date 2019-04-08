import { Typography } from '@material-ui/core'
import { purple } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { toDateText } from '../helpers/toDateText'
import { px } from '../libs/px'
import { Post } from '../types/models/post'
import Images from './Images'
import PostCounts from './PostCounts'

type Props = {
  post: Post
}

const ListItemPost: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyle({})

  return (
    <div className={classes.root}>
      <div className={classes.grid}>
        <PostCounts likeCount={post.likeCount} />
        <Typography className={classes.text} variant={'body2'}>
          <span>{post.text}</span>
        </Typography>
        {post.photoURLs.length !== 0 && <Images photoURLs={post.photoURLs} />}
        <Typography color={'textSecondary'} variant={'caption'}>
          {toDateText(post.createdAt)}
        </Typography>
      </div>
    </div>
  )
}

const useStyle = makeStyles(({ palette, spacing, typography }) => {
  return {
    root: { padding: px(spacing(2)) },
    likeCount: { paddingLeft: spacing(1), color: palette.secondary.light },
    replyPostCount: { color: purple.A400, paddingLeft: spacing(1) },
    grid: {
      display: 'grid',
      gridRowGap: px(8),
      paddingRight: '0 !important'
    },
    text: {
      fontSize: typography.pxToRem(16),
      fontWeight: typography.fontWeightMedium,
      whiteSpace: 'pre-line',
      wordBreak: 'break-all'
    }
  }
})

export default ListItemPost
