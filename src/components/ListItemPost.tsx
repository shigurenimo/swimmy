import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { PostUi } from '../interfaces/models/postUi'
import { px } from '../libs/styles/px'
import ExpansionPanelSummaryPost from './ExpansionPanelSummaryPost'

type Props = {
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

const useStyle = makeStyles(({ spacing }) => {
  return {
    root: { padding: px(spacing(2)) }
  }
})

export default ListItemPost
