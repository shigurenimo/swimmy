import { ListItem, ListItemText } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { Post } from '../../firestore/types/post'

type Props = { post: Post }

const ListItemThread: FunctionComponent<Props> = ({ post }) => {
  return (
    <ListItem divider button>
      <ListItemText primary={post.text} />
    </ListItem>
  )
}

export default ListItemThread
