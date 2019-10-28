import { Card, Theme, Typography } from '@material-ui/core'
import { purple } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Post } from '../firestore/types/post'
import { toDateText } from '../text/toDateText'
import DivImages from './DivImages'
import DivPostTags from './DivPostTags'

type Props = { post: Post }

const CardPostThread: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyle({})

  return (
    <Card className={classes.root} elevation={0}>
      <div className={classes.grid}>
        <div className={classes.header}>
          <Typography
            className={classes.index}
            component={'span'}
            variant={'caption'}
          >
            {'0'}
          </Typography>
          <Typography
            color={'textSecondary'}
            component={'span'}
            variant={'caption'}
          >
            {toDateText(post.createdAt)}
          </Typography>
        </div>
        <Typography className={classes.text} variant={'body2'}>
          <span>{post.text}</span>
        </Typography>
        {post.photoURLs.length !== 0 && (
          <DivImages photoURLs={post.photoURLs} />
        )}
        <DivPostTags post={post} />
      </div>
    </Card>
  )
}

const useStyle = makeStyles<Theme>(({ palette, spacing, typography }) => {
  return {
    root: {
      paddingBottom: spacing(1.5),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(1.5)
    },
    likeCount: { paddingLeft: spacing(1), color: palette.secondary.light },
    replyPostCount: { color: purple.A400, paddingLeft: spacing(1) },
    grid: {
      display: 'grid',
      gridGap: spacing(1),
      paddingRight: '0 !important'
    },
    header: {
      alignItems: 'center',
      display: 'grid',
      gridGap: spacing(1),
      gridAutoFlow: 'column',
      gridAutoColumns: 'max-content'
    },
    index: {
      color: palette.primary.light,
      fontWeight: 'bold'
    },
    text: {
      fontSize: typography.pxToRem(16),
      fontWeight: typography.fontWeightMedium,
      whiteSpace: 'pre-line',
      wordBreak: 'break-all'
    }
  }
})

export default CardPostThread
