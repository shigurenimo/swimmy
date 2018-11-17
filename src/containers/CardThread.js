import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import React from 'react'
import { Link } from 'react-router-dom'
import { PostCounts } from '../components/PostCounts'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
  isUnmounted = false

  state = { inProgressLike: true }

  render() {
    const { classes, post } = this.props

    return (
      <Link to={`/threads/${post.id}`}>
        <Card>
          <CardContent className={classes.root}>
            <PostCounts
              replyPostCount={post.replyPostCount}
              likeCount={post.likeCount}
            />
            <Typography className={classes.text} variant={'body2'}>
              {post.text}
            </Typography>
            <Typography color={'textSecondary'} variant={'caption'}>
              {post.ui.createdAt}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    )
  }
}

const styles = ({ typography, palette, spacing }) =>
  createStyles({
    root: {
      width: pct(100),
      display: 'grid',
      gridRowGap: px(spacing.unit)
    },
    text: {
      fontSize: typography.pxToRem(16),
      fontWeight: typography.fontWeightMedium,
      whiteSpace: 'pre-line',
      wordBreak: 'break-all'
    }
  })

export const CardThread = withStyles(styles)(Component)
