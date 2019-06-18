import { Card, Theme, Typography } from '@material-ui/core'
import { purple } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'
import DivImages from 'app/shared/components/DivImages'
import DivPostCounts from 'app/shared/components/DivPostCounts'
import { Post } from 'app/shared/firestore/types/post'
import { toDateText } from 'app/shared/helpers/toDateText'
import React, { FunctionComponent } from 'react'

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
        <DivPostCounts likeCount={post.likeCount} />
      </div>
    </Card>
  )
}

const useStyle = makeStyles<Theme>(({ palette, spacing, typography }) => {
  return {
    root: {
      paddingBottom: spacing(1.2),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(1.2)
    },
    likeCount: { paddingLeft: spacing(1), color: palette.secondary.light },
    replyPostCount: { color: purple.A400, paddingLeft: spacing(1) },
    grid: {
      display: 'grid',
      gridGap: spacing(0.5),
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
