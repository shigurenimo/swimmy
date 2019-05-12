import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

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

const useStyles = makeStyles<Theme>(({ palette, spacing }) => {
  return {
    likeCount: { color: palette.secondary.dark },
    replyPostCount: { color: palette.primary.dark },
    root: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: `${spacing(1)}px`,
      gridTemplateColumns: 'max-content'
    }
  }
})

export default PostCounts
