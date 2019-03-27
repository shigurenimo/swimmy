import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { px } from '../libs/px'
import ExpansionPanelSummaryPost from './ExpansionPanelSummaryPost'
import { Post } from '../types/models/post'

type Props = {
  post: Post
}

const ListItemPost: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyle({})

  return (
    <div className={classes.root}>
      <ExpansionPanelSummaryPost post={post} />
    </div>
  )
}

const useStyle = makeStyles(({ spacing }) => {
  return {
    root: { padding: px(spacing(2)) }
  }
})

export default ListItemPost
