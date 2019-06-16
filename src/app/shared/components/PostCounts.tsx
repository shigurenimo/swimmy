import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { WORD_LIKE, WORD_RESPONSE } from 'app/shared/constants/word'
import { px } from 'app/shared/styles/px'
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
          {`${WORD_RESPONSE} ${replyPostCount}`}
        </Typography>
      )}
      {likeCount > 0 && (
        <Typography className={classes.likeCount}>
          {`${WORD_LIKE} ${likeCount}`}
        </Typography>
      )}
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ palette, spacing }) => {
  return {
    likeCount: {
      color: palette.secondary.main,
      fontSize: px(12),
      fontWeight: 'bold'
    },
    replyPostCount: {
      color: palette.primary.main,
      fontSize: px(12),
      fontWeight: 'bold'
    },
    root: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: `${spacing(1)}px`,
      gridTemplateColumns: 'max-content'
    }
  }
})

export default PostCounts
