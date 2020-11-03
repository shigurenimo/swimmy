import { Divider, Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import firebase from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { FragmentHead } from '../app/FragmentHead'
import { useAnalytics } from '../app/useAnalytics'
import { ButtonMore } from '../common/ButtonMore'
import { useSearchOrderBy } from '../common/hooks/useSearchOrderBy'
import { DivSkeleton } from '../post/DivSkeleton'
import { LinkThread } from './components/LinkThread'
import { useThreads } from './hooks/useThreads'
import { useThreadsLimit } from './hooks/useThreadsLimit'

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
    firebase.analytics().logEvent('tap_to_read_next_threads')
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
