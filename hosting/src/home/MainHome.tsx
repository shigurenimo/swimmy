import { Divider, Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import firebase from 'firebase/app'
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

  const classes = useStyles()

  useEffect(() => {
    if (posts.length === 0) return
    setLoading(false)
  }, [posts.length])

  const onReadNext = () => {
    setLoading(true)
    setLimit((_limit) => _limit + 32)
    firebase.analytics().logEvent('tap_to_read_next_posts')
  }

  const skeletons = loading && posts.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : []

  const hasNext = posts.length !== 0 && limit < 400

  return (
    <main className={classes.main}>
      <FragmentHead title={null} />
      <Toolbar />
      <TextFieldPost />
      <ul className={classes.posts}>
        {skeletons.map((n) => (
          <li key={n}>
            <DivSkeleton />
            <Divider />
          </li>
        ))}
        {posts.map((post) => (
          <li key={post.id}>
            <LinkPost key={post.id} post={post} />
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
    main: { display: 'grid', gridGap: spacing(2) },
    posts: { display: 'grid', margin: 0, paddingLeft: 0 },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10),
    },
    next: {
      alignItems: 'center',
      display: 'grid',
      gridAutoColumns: 'max-content',
      justifyContent: 'center',
      padding: spacing(2),
    },
  }
})
