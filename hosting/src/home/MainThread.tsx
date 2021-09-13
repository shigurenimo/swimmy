import { Box, List, ListItem, Stack, Toolbar } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import { FragmentHead } from 'src/core/components/FragmentHead'
import { useAnalytics } from 'src/core/hooks/useAnalytics'
import { toThreadDescription } from 'src/core/utils/toThreadDescription'
import { DivResponse } from 'src/home/components/DivResponse'
import { DivThread } from 'src/home/components/DivThread'
import { MainThreadNotFound } from 'src/home/components/MainThreadNotFound'
import { DivSkeleton } from 'src/post/DivSkeleton'
import { TextFieldResponse } from 'src/thread/components/TextFieldResponse'
import { useResponseList } from 'src/thread/hooks/useResponseList'
import { useThread } from 'src/thread/hooks/useThread'

export const MainThread: FunctionComponent = () => {
  useAnalytics()

  const { threadId } = useParams<{ threadId: string }>()

  const responseList = useResponseList(threadId)

  const thread = useThread(threadId)

  const isLoading = responseList.isLoading || thread.isLoading

  const skeletons = isLoading ? [0, 1, 2, 3] : []

  if (!isLoading && !thread.data) {
    return <MainThreadNotFound />
  }

  return (
    <Stack component={'main'}>
      {thread.data && (
        <FragmentHead
          title={`「${thread.data?.text}」`}
          description={toThreadDescription(thread.data)}
        />
      )}
      <Toolbar />
      <List disablePadding>
        {thread.data && (
          <ListItem
            sx={{
              py: (theme) => theme.spacing(2),
              '&:hover': {
                background: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <DivThread post={thread.data} />
          </ListItem>
        )}
        {skeletons.map((n) => (
          <ListItem
            key={n}
            sx={{
              py: (theme) => theme.spacing(2),
              '&:hover': {
                background: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <DivSkeleton />
          </ListItem>
        ))}
        {responseList.data?.map((post, index) => (
          <ListItem
            key={post.id}
            sx={{
              py: (theme) => theme.spacing(2),
              '&:hover': {
                background: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <DivResponse index={index + 1} post={post} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: (theme) => theme.spacing(2) }}>
        {!isLoading && thread && <TextFieldResponse threadId={threadId} />}
      </Box>
    </Stack>
  )
}
