import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import firebase from 'firebase/app'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { DivPostCounts } from '../../common/DivPostCounts'
import { Post } from '../../firebase/types/post'
import { DivImages } from '../../layout/DivImages'
import { toDateText } from '../../text/toDateText'

type Props = {
  inProgress?: boolean
  post: Post
}

export const LinkPost: FunctionComponent<Props> = ({ inProgress, post }) => {
  const classes = useStyles()

  return (
    <Link className={classes.root} to={`/threads/${post.id}`}>
      <div
        className={classes.data}
        onClick={() => {
          firebase.analytics().logEvent('select_content', {
            content_id: post.id,
            content_type: 'post',
          })
        }}
      >
        <Typography color={'textSecondary'} variant={'caption'}>
          {toDateText(post.createdAt)}
        </Typography>
        <DivPostCounts replyPostCount={post.replyPostCount} />
      </div>
      <Typography className={classes.text} variant={'body2'}>
        {post.text}
      </Typography>
      {post.fileIds.length !== 0 && <DivImages fileIds={post.fileIds} />}
    </Link>
  )
}

const useStyles = makeStyles<Theme>(({ spacing, typography }) => {
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
