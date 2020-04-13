import { Divider, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import DivPostCounts from '../../common/DivPostCounts'
import { Post } from '../../firestore/types/post'
import { toDateText } from '../../text/toDateText'
import { useResponses } from '../hooks/useResponses'

type Props = { post: Post }

const LinkThreadNext: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles()

  const [responses] = useResponses(post.id)

  return (
    <div className={classes.root}>
      <Link className={classes.link} to={`/threads/${post.id}`}>
        <div className={classes.data}>
          <Typography color={'textSecondary'} variant={'caption'}>
            {toDateText(post.createdAt)}
          </Typography>
          <DivPostCounts replyPostCount={post.replyPostCount} />
        </div>
        <Typography className={classes.text} variant={'body2'}>
          {post.text}
        </Typography>
      </Link>
      <div>
        {responses.map(response => (
          <div className={classes.response} key={response.id}>
            <Divider />
            <div className={classes.content}>
              <Typography className={classes.responseText} variant={'caption'}>
                {response.text}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ typography, palette, spacing }) => {
  return {
    root: {
      borderRadius: 0,
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
    link: {
      display: 'grid',
      gridGap: spacing(0.5),
      paddingBottom: spacing(1.5),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(1.2),
      '&:hover': { background: 'rgba(0, 0, 0, 0.1)' },
    },
    response: { background: 'rgba(0, 0, 0, 0.2)' },
    responseText: {
      whiteSpace: 'pre-line',
      wordBreak: 'break-all',
    },
    content: {
      paddingBottom: spacing(1),
      paddingLeft: spacing(3),
      paddingRight: spacing(2),
      paddingTop: spacing(1),
    },
  }
})

export default LinkThreadNext
