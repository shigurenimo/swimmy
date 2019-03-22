import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import React, { FunctionComponent } from 'react'
import { PostUi } from '../interfaces/models/postUi'

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
