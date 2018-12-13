import makeStyles from '@material-ui/styles/makeStyles'
import React, { FunctionComponent } from 'react'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { px } from '../libs/styles/px'
import ExpansionPanelSummaryPost from './ExpansionPanelSummaryPost'

const useStyle = makeStyles(({ spacing }) => {
  return {
    root: { padding: px(spacing.unit * 2) }
  }
})

interface Props {
  post: PostUi
}

const ListItemPost: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyle({})

  return (
    <div className={classes.root}>
      <ExpansionPanelSummaryPost post={post} />
    </div>
  )
}

export default ListItemPost
