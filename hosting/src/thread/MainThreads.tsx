import { Divider, List, ListItem, Stack, Toolbar } from '@mui/material'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { ButtonMore } from 'src/core/components/ButtonMore'
import { FragmentHead } from 'src/core/components/FragmentHead'
import { useAnalytics } from 'src/core/hooks/useAnalytics'
import { useSearchOrderBy } from 'src/core/hooks/useSearchOrderBy'
import { DivSkeleton } from 'src/post/DivSkeleton'
import { LinkThread } from 'src/thread/components/LinkThread'
import { useThreads } from 'src/thread/hooks/useThreads'
import { useThreadsLimit } from 'src/thread/hooks/useThreadsLimit'

export const MainThreads: FunctionComponent = () => {
  const orderBy = useSearchOrderBy()

  const [limit, setLimit] = useThreadsLimit(orderBy)

  const [posts] = useThreads(limit, orderBy)

  const [isLoading, setLoading] = useState(posts.length === 0)

  useAnalytics()

  useEffect(() => {
    if (posts.length === 0) return
    setLoading(false)
  }, [posts.length])

  const onReadNext = () => {
    setLoading(true)
    setLimit((_limit) => _limit + 16)
    logEvent(getAnalytics(), 'tap_to_read_next_threads')
  }

  const skeletons = isLoading && posts.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : []

  const hasNext = posts.length !== 0 && limit < 400

  return (
    <Stack component={'main'}>
      <FragmentHead title={'スレッド'} />
      <Toolbar />
      <List sx={{ width: '100%' }}>
        {skeletons.map((n) => (
          <ListItem key={n}>
            <DivSkeleton />
            <Divider />
          </ListItem>
        ))}
        {posts.map((post) => (
          <ListItem key={post.id}>
            <LinkThread post={post} />
            <Divider />
          </ListItem>
        ))}
      </List>
      {hasNext && (
        <Stack direction={'row'} justifyContent={'center'}>
          <ButtonMore onClick={onReadNext} inProgress={isLoading} />
        </Stack>
      )}
    </Stack>
  )
}
