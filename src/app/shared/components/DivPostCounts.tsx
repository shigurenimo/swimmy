import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { WORD_LIKE, WORD_RESPONSE } from 'app/shared/constants/word'
import { px } from 'app/shared/styles/px'
import React, { FunctionComponent } from 'react'

type Props = {
  replyPostCount?: number
  likeCount: number
}

const DivPostCounts: FunctionComponent<Props> = ({
  replyPostCount,
  likeCount
}) => {
  const classes = useStyles({})

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
      {replyPostCount && replyPostCount > 0 && (
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
      alignItems: 'center',
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: `${spacing(1)}px`,
      gridTemplateColumns: 'max-content'
    }
  }
})

export default DivPostCounts
