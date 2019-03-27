import { ListItem, Typography } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { PostUi } from '../types/models/postUi'

type Props = {
  post: PostUi
}

const ListItemReplyPost: FunctionComponent<Props> = ({ post }) => {
  return (
    <ListItem button divider>
      <div>
        <Typography gutterBottom>{post.text}</Typography>
        <Typography color={'textSecondary'} variant={'caption'}>
          {post.ui.createdAt}
        </Typography>
      </div>
    </ListItem>
  )
}

export default ListItemReplyPost
