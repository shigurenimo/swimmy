import { Theme, Typography } from '@material-ui/core'
import { purple } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Post } from 'src/core/types/post'
import { toDateText } from 'src/core/utils/toDateText'
import { DivThreadImages } from 'src/home/components/DivThreadImages'

type Props = { post: Post }

export const DivThread: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
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
        {post.text}
      </Typography>
      {post.fileIds.length !== 0 && <DivThreadImages fileIds={post.fileIds} />}
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ palette, spacing, typography }) => {
  return {
    header: {
      alignItems: 'center',
      display: 'grid',
      gridGap: spacing(1),
      gridAutoFlow: 'column',
      gridAutoColumns: 'max-content',
    },
    index: { color: palette.primary.light, fontWeight: 'bold' },
    replyPostCount: { color: purple.A400, paddingLeft: spacing(1) },
    root: {
      display: 'grid',
      gridGap: spacing(1),
      paddingBottom: spacing(1.5),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(1.5),
    },
    text: {
      fontSize: typography.pxToRem(16),
      whiteSpace: 'pre-line',
      wordBreak: 'break-all',
    },
  }
})
