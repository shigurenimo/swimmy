import { Theme, Typography } from '@material-ui/core'
import { purple } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Post } from '../../firestore/types/post'
import DivImages from '../../layout/DivImages'
import { toDateText } from '../../text/toDateText'

type Props = {
  post: Post
  index: number
}

const DivResponse: FunctionComponent<Props> = ({ post, index }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography
          className={classes.index}
          component={'span'}
          variant={'caption'}
        >
          {index}
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
      {post.photoURLs.length !== 0 && <DivImages photoURLs={post.photoURLs} />}
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ palette, spacing, typography }) => {
  return {
    root: {
      paddingBottom: spacing(1.5),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(1.5),
      display: 'grid',
      gridGap: spacing(1),
    },
    likeCount: { paddingLeft: spacing(1), color: palette.secondary.light },
    replyPostCount: { color: purple.A400, paddingLeft: spacing(1) },
    header: {
      alignItems: 'center',
      display: 'grid',
      gridGap: spacing(1),
      gridAutoFlow: 'column',
      gridAutoColumns: 'max-content',
    },
    index: {
      color: palette.primary.light,
      fontWeight: 'bold',
    },
    text: {
      fontSize: typography.pxToRem(16),
      whiteSpace: 'pre-line',
      wordBreak: 'break-all',
    },
  }
})

export default DivResponse
