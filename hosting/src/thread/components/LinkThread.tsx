import { Stack, Typography } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { DivPostCounts } from 'src/core/components/DivPostCounts'
import { Post } from 'src/core/types/post'
import { toDateText } from 'src/core/utils/toDateText'

type Props = { post: Post }

export const LinkThread: FunctionComponent<Props> = ({ post }) => {
  return (
    <Link to={`/threads/${post.id}`}>
      <Stack
        direction={'row'}
        sx={{
          borderRadius: 0,
          '&:hover': { background: 'rgba(0, 0, 0, 0.1)' },
        }}
      >
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography color={'textSecondary'} variant={'caption'}>
            {toDateText(post.updatedAt)}
          </Typography>
          <DivPostCounts replyPostCount={post.replyPostCount} />
        </Stack>
        <Typography
          variant={'body2'}
          sx={{
            fontSize: (theme) => theme.typography.pxToRem(16),
            whiteSpace: 'pre-line',
            wordBreak: 'break-all',
          }}
        >
          {post.text}
        </Typography>
      </Stack>
    </Link>
  )
}
