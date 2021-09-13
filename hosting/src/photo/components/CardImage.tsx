import { Card, CardActionArea, CardMedia } from '@mui/material'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { Post } from 'src/core/types/post'

type Props = { post: Post }

export const CardImage: FunctionComponent<Props> = ({ post }) => {
  return (
    <Link
      to={`/threads/${post.id}`}
      onClick={() => {
        logEvent(getAnalytics(), 'select_content', {
          content_id: post.id,
          content_type: 'photo',
        })
      }}
    >
      <Card>
        <CardActionArea sx={{ actionArea: { width: `${100}%` } }}>
          <CardMedia
            component={'img'}
            image={`//swimmy.io/images/${post.fileIds[0]}?fm=png&w=400&h=400`}
          />
        </CardActionArea>
      </Card>
    </Link>
  )
}
