import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import purple from '@material-ui/core/colors/purple'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import React from 'react'

class Component extends React.Component<any, any> {
  isUnmounted = false

  state = { inProgressLike: true }

  render() {
    const { classes, post, onSelectPost } = this.props

    return (
      <Card onClick={onSelectPost}>
        <CardContent>
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
            {post.ui.createdAt}
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

const styles = ({ typography, palette, spacing }) =>
  createStyles({
    root: { width: '100%' },
    text: {
      fontSize: typography.pxToRem(16),
      fontWeight: typography.fontWeightMedium,
      whiteSpace: 'pre-line',
      wordBreak: 'break-all'
    },
    likeCount: { paddingLeft: spacing.unit, color: palette.secondary.light },
    replyPostCount: { color: purple['A400'], paddingLeft: spacing.unit }
  })

export const CardThread = withStyles(styles)(Component)
