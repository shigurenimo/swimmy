import { Box, Divider, Stack, Toolbar } from '@material-ui/core'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { ButtonMore } from 'src/core/components/ButtonMore'
import { FragmentHead } from 'src/core/components/FragmentHead'
import { useAnalytics } from 'src/core/hooks/useAnalytics'
import { LinkPost } from 'src/home/components/LinkPost'
import { TextFieldPost } from 'src/home/components/TextFieldPost'
import { useHomePosts } from 'src/home/hooks/useHomePosts'
import { useHomePostsLimit } from 'src/home/hooks/useHomePostsLimit'
import { DivSkeleton } from 'src/post/DivSkeleton'

export const MainHome: FunctionComponent = () => {
  const [limit, setLimit] = useHomePostsLimit()

  const [posts] = useHomePosts(limit)

  const [loading, setLoading] = useState(posts.length === 0)

  useAnalytics()

  useEffect(() => {
    if (posts.length === 0) return
    setLoading(false)
  }, [posts.length])

  const onReadNext = () => {
    setLoading(true)
    setLimit((_limit) => _limit + 32)
    logEvent(getAnalytics(), 'tap_to_read_next_posts')
  }

  const skeletons = loading && posts.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : []

  const hasNext = posts.length !== 0 && limit < 400

  return (
    <Stack component={'main'} spacing={2}>
      <FragmentHead title={null} />
      <Toolbar />
      <TextFieldPost />
      <Stack
        component={'ul'}
        spacing={2}
        sx={{ display: 'grid', margin: 0, paddingLeft: 2, paddingRight: 2 }}
      >
        {skeletons.map((n) => (
          <li key={n}>
            <DivSkeleton />
            <Divider />
          </li>
        ))}
        {posts.map((post) => (
          <li key={post.id}>
            <LinkPost key={post.id} post={post} />
          </li>
        ))}
      </Stack>
      {hasNext && (
        <Box
          sx={{
            alignItems: 'center',
            display: 'grid',
            gridAutoColumns: 'max-content',
            justifyContent: 'center',
            padding: (theme) => theme.spacing(2),
          }}
        >
          <ButtonMore onClick={onReadNext} inProgress={loading} />
        </Box>
      )}
    </Stack>
  )
}
