import { Divider, Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useEffect, useState } from 'react'
import ButtonMore from '../common/ButtonMore'
import DivSkeleton from '../skeleton/DivSkeleton'
import FragmentHead from '../web/FragmentHead'
import { useAnalytics } from '../web/useAnalytics'
import LinkPost from './components/LinkPost'
import TextFieldPost from './components/TextFieldPost'
import { useHomePosts } from './hooks/useHomePosts'
import { useHomePostsLimit } from './hooks/useHomePostsLimit'

const MainHome: FunctionComponent = () => {
  const [limit, setLimit] = useHomePostsLimit()

  const [posts] = useHomePosts(limit)

  const [loading, setLoading] = useState(posts.length === 0)

  useAnalytics()

  const classes = useStyles()

  useEffect(() => {
    if (posts.length === 0) return
    setLoading(false)
  }, [posts.length])

  const onNext = () => {
    setLoading(true)
    setLimit(_limit => _limit + 32)
  }

  const skeletons = loading && posts.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : []

  const hasNext = posts.length !== 0 && limit < 400

  return (
    <main className={classes.main}>
      <FragmentHead title={null} />
      <Toolbar />
      <TextFieldPost />
      <ul className={classes.posts}>
        {skeletons.map(n => (
          <li key={n}>
            <DivSkeleton />
            <Divider />
          </li>
        ))}
        {posts.map(post => (
          <li key={post.id}>
            <LinkPost key={post.id} post={post} />
            <Divider />
          </li>
        ))}
      </ul>
      {hasNext && (
        <div className={classes.next}>
          <ButtonMore onClick={onNext} inProgress={loading} />
        </div>
      )}
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    main: { display: 'grid', gridGap: spacing(1) },
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

export default MainHome
