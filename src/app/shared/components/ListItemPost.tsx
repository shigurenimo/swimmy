import { Theme, Typography } from '@material-ui/core'
import { purple } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'
import DivImages from 'app/shared/components/DivImages'
import PostCounts from 'app/shared/components/PostCounts'
import { Post } from 'app/shared/firestore/types/post'
import { toDateText } from 'app/shared/helpers/toDateText'
import React, { FunctionComponent } from 'react'

type Props = { post: Post }

const ListItemPost: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyle({})

  return (
    <div className={classes.root}>
      <div className={classes.grid}>
        <PostCounts likeCount={post.likeCount} />
        <Typography className={classes.text} variant={'body2'}>
          <span>{post.text}</span>
        </Typography>
        {post.photoURLs.length !== 0 && (
          <DivImages photoURLs={post.photoURLs} />
        )}
        <Typography color={'textSecondary'} variant={'caption'}>
          {toDateText(post.createdAt)}
        </Typography>
      </div>
    </div>
  )
}

const useStyle = makeStyles<Theme>(({ palette, spacing, typography }) => {
  return {
    root: { padding: `${spacing(2)}px` },
    likeCount: { paddingLeft: spacing(1), color: palette.secondary.light },
    replyPostCount: { color: purple.A400, paddingLeft: spacing(1) },
    grid: {
      display: 'grid',
      gridRowGap: `${8}px`,
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
