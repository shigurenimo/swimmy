import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { WORD_RESPONSE } from '../text/word'

type Props = { replyPostCount: number }

const DivPostCounts: FunctionComponent<Props> = ({ replyPostCount = 0 }) => {
  const classes = useStyles()

  if (!replyPostCount) {
    return null
  }

  return (
    <div className={classes.root}>
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
      fontSize: `${12}px`,
      fontWeight: 'bold',
    },
    replyPostCount: {
      color: palette.primary.dark,
      fontSize: `${12}px`,
      fontWeight: 'bold',
    },
    root: {
      alignItems: 'center',
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: spacing(1),
      gridTemplateColumns: 'max-content',
    },
  }
})

export default DivPostCounts
