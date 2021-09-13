import { Stack, Typography } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { BoxImages } from 'src/core/components/DivImages'
import { Post } from 'src/core/types/post'
import { toDateText } from 'src/core/utils/toDateText'

type Props = {
  post: Post
  index: number
}

export const DivResponse: FunctionComponent<Props> = ({ post, index }) => {
  return (
    <Stack>
      <Stack direction={'row'} spacing={2}>
        <Typography
          component={'span'}
          variant={'caption'}
          sx={{
            color: (theme) => theme.palette.primary.light,
            fontWeight: 'bold',
          }}
        >
          {index}
        </Typography>
        <Typography
          color={'textSecondary'}
          component={'span'}
          variant={'caption'}
        >
          {toDateText(post.createdAt)}
        </Typography>
      </Stack>
      <Typography
        variant={'body2'}
        sx={{
          color: (theme) => theme.palette.primary.light,
          fontWeight: 'bold',
        }}
      >
        {post.text}
      </Typography>
      {post.fileIds.length !== 0 && <BoxImages fileIds={post.fileIds} />}
    </Stack>
  )
}
