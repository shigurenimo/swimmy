import purple from '@material-ui/core/colors/purple'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Images } from '../components/Images'
import { px } from '../libs/styles/px'
import { PostCounts } from './PostCounts'

const Component = ({ classes, post }) => {
  return (
    <div className={classes.root}>
      <PostCounts
        replyPostCount={post.replyPostCount}
        likeCount={post.likeCount}
      />
      <Typography className={classes.text} variant={'body2'}>
        {post.text}
      </Typography>
      {post.photoURLs.length !== 0 && <Images photoURLs={post.photoURLs} />}
      <Typography color={'textSecondary'} variant={'caption'}>
        {post.ui.createdAt}
      </Typography>
    </div>
  )
}

const styles = ({ breakpoints, typography, palette, spacing }) =>
  createStyles({
    root: {
      paddingRight: '0 !important',
      display: 'grid',
      gridRowGap: px(8)
    },
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
