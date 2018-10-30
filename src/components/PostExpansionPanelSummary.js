import purple from '@material-ui/core/colors/purple'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

const Component = ({ classes, post }) => (
  <div className={classes.root}>
    <Typography className={classes.text} gutterBottom variant={'body2'}>
      {post.text}
      {post.likeCount > 0 && (
        <span className={classes.likeCount}>+ {post.likeCount}</span>
      )}
      {post.replyPostCount > 0 && (
        <span className={classes.replyPostCount}>+ {post.replyPostCount}</span>
      )}
    </Typography>
    <Typography variant={'caption'} color={'textSecondary'}>
      {post.ui.createdAt}
    </Typography>
  </div>
)

const styles = theme =>
  createStyles({
    root: {
      paddingRight: '0 !important',
      width: '100%'
    },
    text: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightMedium,
      whiteSpace: 'pre-line',
      wordBreak: 'break-all'
    },
    likeCount: {
      paddingLeft: 8,
      color: theme.palette.secondary.light
    },
    replyPostCount: {
      paddingLeft: 8,
      color: purple['A400']
    }
  })

export const PostExpansionPanelSummary = withStyles(styles)(Component)
