import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/styles/makeStyles'
import React, { FunctionComponent } from 'react'
import { px } from '../libs/styles/px'

interface Props {
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
    root: {
      display: 'grid',
      gridTemplateColumns: 'max-content',
      gridAutoFlow: 'column',
      gridColumnGap: px(spacing.unit)
    },
    likeCount: { color: palette.secondary.dark },
    replyPostCount: { color: palette.primary.dark }
  }
})

export default PostCounts
