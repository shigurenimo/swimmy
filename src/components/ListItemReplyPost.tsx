import ListItem from '@material-ui/core/ListItem/ListItem'
import Typography from '@material-ui/core/Typography'
import React, { SFC } from 'react'
import { PostUi } from '../interfaces/models/post/postWithUi'

interface Props {
  post: PostUi
}

const ListItemReplyPost: SFC<Props> = ({ post }) => {
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
