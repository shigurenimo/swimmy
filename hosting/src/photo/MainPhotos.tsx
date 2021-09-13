import { Grid, Stack, Toolbar } from '@mui/material'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { ButtonMore } from 'src/core/components/ButtonMore'
import { FragmentHead } from 'src/core/components/FragmentHead'
import { useAnalytics } from 'src/core/hooks/useAnalytics'
import { useSearchOrderBy } from 'src/core/hooks/useSearchOrderBy'
import { WORD_PHOTO } from 'src/core/types/word'
import { CardImage } from 'src/photo/components/CardImage'
import { TextFieldPhoto } from 'src/photo/components/TextFieldPhoto'
import { useImages } from 'src/photo/hooks/useImages'
import { useImagesLimit } from 'src/photo/hooks/useImagesLimit'

export const MainPhotos: FunctionComponent = () => {
  const orderBy = useSearchOrderBy()

  const [limit, setLimit] = useImagesLimit(orderBy)

  const [posts] = useImages(limit, orderBy)

  const [loading, setLoading] = useState(posts.length === 0)

  useAnalytics()

  useEffect(() => {
    if (posts.length === 0) return
    setLoading(false)
  }, [posts.length])

  const onReadNext = () => {
    setLoading(true)
    setLimit((_limit) => _limit + 16)
    logEvent(getAnalytics(), 'tap_to_read_next_photos')
  }

  const hasNext = posts.length !== 0 && limit < 400

  return (
    <Stack>
      <FragmentHead
        title={WORD_PHOTO}
        description={`${WORD_PHOTO}の添付された書き込みです。`}
      />
      <Toolbar />
      <TextFieldPhoto />
      <Grid
        container
        direction={'row'}
        sx={{
          sm: { gridTemplateColumns: 'repeat(2, 1fr)' },
          md: { gridTemplateColumns: 'repeat(3, 1fr)' },
          lg: { gridTemplateColumns: 'repeat(4, 1fr)' },
        }}
      >
        {posts.map((post) => (
          <Grid item key={post.id}>
            <CardImage post={post} />
          </Grid>
        ))}
      </Grid>
      {hasNext && (
        <Stack direction={'row'} justifyContent={'center'}>
          <ButtonMore onClick={onReadNext} inProgress={loading} />
        </Stack>
      )}
    </Stack>
  )
}
