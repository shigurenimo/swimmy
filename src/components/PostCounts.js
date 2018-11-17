import createStyles from '@material-ui/core/es/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import React from 'react'
import { px } from '../libs/styles/px'

const Component = ({ classes, replyPostCount, likeCount }) => {
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

const styles = ({ palette, spacing }) =>
  createStyles({
    root: {
      display: 'grid',
      gridTemplateColumns: 'max-content',
      gridAutoFlow: 'column',
      gridColumnGap: px(spacing.unit)
    },
    likeCount: { color: palette.secondary.light },
    replyPostCount: { color: palette.primary.light }
  })

export const PostCounts = withStyles(styles)(Component)
