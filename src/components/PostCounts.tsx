import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { px } from '../libs/px'

type Props = {
  replyPostCount?: number
  likeCount: number
}

const PostCounts: FunctionComponent<Props> = ({
  replyPostCount,
  likeCount
}) => {
  const classes = useStyles({})

  if (!replyPostCount && !likeCount) {
    return null
  }

  return (
    <div className={classes.root}>
      {replyPostCount && replyPostCount > 0 && (
        <Typography className={classes.replyPostCount}>
          {`レス ${replyPostCount}`}
        </Typography>
      )}
      {likeCount > 0 && (
        <Typography className={classes.likeCount}>
          {`スキ ${likeCount}`}
        </Typography>
      )}
    </div>
  )
}

const useStyles = makeStyles(({ palette, spacing }) => {
  return {
    likeCount: { color: palette.secondary.dark },
    replyPostCount: { color: palette.primary.dark },
    root: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: px(spacing(1)),
      gridTemplateColumns: 'max-content'
    }
  }
})

export default PostCounts
