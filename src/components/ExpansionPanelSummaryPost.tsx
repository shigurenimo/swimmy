import purple from '@material-ui/core/colors/purple'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { px } from '../libs/styles/px'
import Images from './Images'
import PostCounts from './PostCounts'

interface Props {
  post: PostUi
}

const ExpansionPanelSummaryPost: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles({})

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

const useStyles = makeStyles(
  ({ breakpoints, typography, palette, spacing }) => {
    return {
      likeCount: { paddingLeft: spacing.unit, color: palette.secondary.light },
      replyPostCount: { color: purple.A400, paddingLeft: spacing.unit },
      root: {
        display: 'grid',
        gridRowGap: px(8),
        paddingRight: '0 !important'
      },
      text: {
        fontSize: typography.pxToRem(16),
        fontWeight: typography.fontWeightMedium,
        whiteSpace: 'pre-line',
        wordBreak: 'break-all'
      }
    }
  }
)

export default ExpansionPanelSummaryPost
