import { ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import { Post } from 'src/core/types/post'
import { toDateText } from 'src/core/utils/toDateText'

type Props = {
  post: Post
  selected: boolean
}

export const ListItemThread: FunctionComponent<Props> = ({
  post,
  selected = false,
}) => {
  const history = useHistory()

  const onClick = () => {
    logEvent(getAnalytics(), 'select_content', {
      content_id: post.id,
      content_type: 'thread',
    })
    history.push(`/threads/${post.id}`)
  }

  return (
    <ListItem disabled={selected} button divider onClick={onClick}>
      <ListItemText
        primary={post.text}
        secondary={
          <Stack spacing={2}>
            <Typography
              variant={'caption'}
              sx={{
                color: (theme) => theme.palette.primary.dark,
                fontWeight: 'bold',
              }}
            >
              {`${post.replyPostCount}コメント`}
            </Typography>
            <Typography variant={'caption'}>
              {toDateText(post.updatedAt)}
            </Typography>
          </Stack>
        }
      />
    </ListItem>
  )
}
