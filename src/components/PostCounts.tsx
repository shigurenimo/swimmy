import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { px } from '../libs/styles/px'

type Props = {
  replyPostCount: number
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
      {replyPostCount > 0 && (
        <Typography className={classes.replyPostCount}>
          {`RES ${replyPostCount}`}
        </Typography>
      )}
      {likeCount > 0 && (
        <Typography className={classes.likeCount}>
          {`HEART ${likeCount}`}
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
      gridColumnGap: px(spacing.unit),
      gridTemplateColumns: 'max-content'
    }
  }
})

export default PostCounts
