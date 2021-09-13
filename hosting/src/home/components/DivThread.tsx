import { Stack, Typography } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { Post } from 'src/core/types/post'
import { toDateText } from 'src/core/utils/toDateText'
import { DivThreadImages } from 'src/home/components/DivThreadImages'

type Props = { post: Post }

export const DivThread: FunctionComponent<Props> = ({ post }) => {
  return (
    <Stack>
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        <Typography
          component={'span'}
          variant={'caption'}
          sx={{
            color: (theme) => theme.palette.primary.light,
            fontWeight: 'bold',
          }}
        >
          {'0'}
        </Typography>
        <Typography
          component={'span'}
          color={'textSecondary'}
          variant={'caption'}
        >
          {toDateText(post.createdAt)}
        </Typography>
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
      {post.fileIds.length !== 0 && <DivThreadImages fileIds={post.fileIds} />}
    </Stack>
  )
}
