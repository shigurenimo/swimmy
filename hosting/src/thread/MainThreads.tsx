import { Divider, Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
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

  const [loading, setLoading] = useState(posts.length === 0)

  const classes = useStyles()

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

  const skeletons = loading && posts.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : []

  const hasNext = posts.length !== 0 && limit < 400

  return (
    <main className={classes.root}>
      <FragmentHead title={'スレッド'} />
      <Toolbar />
      <ul className={classes.posts}>
        {skeletons.map((n) => (
          <li key={n}>
            <DivSkeleton />
            <Divider />
          </li>
        ))}
        {posts.map((post) => (
          <li key={post.id}>
            <LinkThread post={post} />
            <Divider />
          </li>
        ))}
      </ul>
      {hasNext && (
        <div className={classes.next}>
          <ButtonMore onClick={onReadNext} inProgress={loading} />
        </div>
      )}
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    posts: { display: 'grid' },
    root: { display: 'grid' },
    next: {
      alignItems: 'center',
      display: 'grid',
      gridAutoColumns: 'max-content',
      justifyContent: 'center',
      padding: spacing(2),
    },
  }
})
