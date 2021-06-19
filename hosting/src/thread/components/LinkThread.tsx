import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { DivPostCounts } from 'src/core/components/DivPostCounts'
import { Post } from 'src/core/types/post'
import { toDateText } from 'src/core/utils/toDateText'

type Props = { post: Post }

export const LinkThread: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles()

  return (
    <Link className={classes.root} to={`/threads/${post.id}`}>
      <div className={classes.data}>
        <Typography color={'textSecondary'} variant={'caption'}>
          {toDateText(post.updatedAt)}
        </Typography>
        <DivPostCounts replyPostCount={post.replyPostCount} />
      </div>
      <Typography className={classes.text} variant={'body2'}>
        {post.text}
      </Typography>
    </Link>
  )
}

const useStyles = makeStyles<Theme>(({ typography, palette, spacing }) => {
  return {
    root: {
      borderRadius: 0,
      display: 'grid',
      gridGap: spacing(0.5),
      paddingBottom: spacing(1.5),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(1.2),
      '&:hover': { background: 'rgba(0, 0, 0, 0.1)' },
    },
    data: {
      display: 'grid',
      gridAutoFlow: 'column',
      justifyContent: 'space-between',
    },
    text: {
      fontSize: typography.pxToRem(16),
      whiteSpace: 'pre-line',
      wordBreak: 'break-all',
    },
  }
})
