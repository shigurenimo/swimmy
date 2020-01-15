import { Divider, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useEffect, useState } from 'react'
import ButtonMore from '../../common/ButtonMore'
import DivCenter from '../../layout/DivCenter'
import CardPostSkeleton from '../../skeleton/CardPostSkeleton'
import { useHomePosts } from '../hooks/useHomePosts'
import { useHomePostsLimit } from '../hooks/useHomePostsLimit'
import CardPost from './CardPost'
import TextFieldPost from './TextFieldPost'

const MainHome: FunctionComponent = () => {
  const [limit, setLimit] = useHomePostsLimit()

  const [posts] = useHomePosts(limit)

  const [loading, setLoading] = useState(posts.length === 0)

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
      <TextFieldPost />
      <section className={classes.section}>
        <ul className={classes.posts}>
          {skeletons.map(n => (
            <li key={n}>
              <CardPostSkeleton />
            </li>
          ))}
          {posts.map((post, index) => (
            <li key={post.id}>
              <CardPost post={post} />
              <Divider />
            </li>
          ))}
        </ul>
        {hasNext && (
          <DivCenter>
            <ButtonMore onClick={onNext} inProgress={loading} />
          </DivCenter>
        )}
      </section>
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
    section: { display: 'grid', gridRowGap: spacing(2) },
  }
})

export default MainHome
