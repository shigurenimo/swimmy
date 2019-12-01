import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { WORD_LIKE, WORD_RESPONSE } from '../text/word'
import { px } from '../styles/px'

type Props = {
  replyPostCount?: number
  likeCount: number
}

const DivPostCounts: FunctionComponent<Props> = ({
  replyPostCount = 0,
  likeCount,
}) => {
  const classes = useStyles()

  if (!replyPostCount && !likeCount) {
    return null
  }

  return (
    <div className={classes.root}>
      {likeCount > 0 && (
        <Typography className={classes.likeCount}>
          {`${WORD_LIKE} ${likeCount}`}
        </Typography>
      )}
      {replyPostCount > 0 && (
        <Typography className={classes.replyPostCount}>
          {`${WORD_RESPONSE} ${replyPostCount}`}
        </Typography>
      )}
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ palette, spacing }) => {
  return {
    likeCount: {
      color: palette.secondary.dark,
      fontSize: px(12),
      fontWeight: 'bold',
    },
    replyPostCount: {
      color: palette.primary.dark,
      fontSize: px(12),
      fontWeight: 'bold',
    },
    root: {
      alignItems: 'center',
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: `${spacing(1)}px`,
      gridTemplateColumns: 'max-content',
    },
  }
})

export default DivPostCounts
