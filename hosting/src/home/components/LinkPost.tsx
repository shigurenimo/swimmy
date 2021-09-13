import { Box, Stack, Typography } from '@mui/material'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { BoxImages } from 'src/core/components/DivImages'
import { DivPostCounts } from 'src/core/components/DivPostCounts'
import { Post } from 'src/core/types/post'
import { toDateText } from 'src/core/utils/toDateText'

type Props = {
  inProgress?: boolean
  post: Post
}

export const LinkPost: FunctionComponent<Props> = ({ inProgress, post }) => {
  return (
    <Link to={`/threads/${post.id}`}>
      <Box
        sx={{
          display: 'grid',
          gap: (theme) => theme.spacing(0.4),
          paddingBottom: (theme) => theme.spacing(1.5),
          paddingLeft: (theme) => theme.spacing(2),
          paddingRight: (theme) => theme.spacing(2),
          paddingTop: (theme) => theme.spacing(1.5),
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: (theme) => theme.shape.borderRadius,

          '&:hover': { background: 'rgba(0, 0, 0, 0.1)' },
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          onClick={() => {
            logEvent(getAnalytics(), 'select_content', {
              content_id: post.id,
              content_type: 'post',
            })
          }}
        >
          <Typography color={'textSecondary'} variant={'caption'}>
            {toDateText(post.createdAt)}
          </Typography>
          <DivPostCounts replyPostCount={post.replyPostCount} />
        </Stack>
        <Typography
          sx={{
            fontSize: (theme) => theme.typography.pxToRem(14),
            whiteSpace: 'pre-line',
            wordBreak: 'break-all',
          }}
          variant={'body2'}
        >
          {post.text}
        </Typography>
        {post.fileIds.length !== 0 && <BoxImages fileIds={post.fileIds} />}
      </Box>
    </Link>
  )
}
