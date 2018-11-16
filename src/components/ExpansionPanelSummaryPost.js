import purple from '@material-ui/core/colors/purple'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { pct } from '../libs/styles/pct'

const Component = ({ classes, post }) => {
  return (
    <div className={classes.root}>
      <Typography className={classes.text} gutterBottom variant={'body2'}>
        {post.text}
        {post.likeCount > 0 && (
          <span className={classes.likeCount}>+ {post.likeCount}</span>
        )}
        {post.replyPostCount > 0 && (
          <span className={classes.replyPostCount}>
            + {post.replyPostCount}
          </span>
        )}
      </Typography>
      <Typography color={'textSecondary'} variant={'caption'}>
        {post.ui.createdAt} - {post.id}
      </Typography>
    </div>
  )
}

const styles = ({ typography, palette, spacing }) =>
  createStyles({
    root: { paddingRight: '0 !important', width: pct(100) },
    text: {
      fontSize: typography.pxToRem(16),
      fontWeight: typography.fontWeightMedium,
      whiteSpace: 'pre-line',
      wordBreak: 'break-all'
    },
    likeCount: { paddingLeft: spacing.unit, color: palette.secondary.light },
    replyPostCount: { color: purple['A400'], paddingLeft: spacing.unit }
  })

export const ExpansionPanelSummaryPost = withStyles(styles)(Component)
