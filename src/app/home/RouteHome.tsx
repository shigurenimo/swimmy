import { CircularProgress, Divider, Fade, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import CardPost from 'app/home/components/CardPost'
import Header from 'app/shared/components/AppBarDefault'
import ButtonMore from 'app/shared/components/ButtonMore'
import FragmentHead from 'app/shared/components/FragmentHead'
import SectionTitle from 'app/shared/components/SectionTitle'
import TextFieldPost from 'app/shared/components/TextFieldPost'
import { POSTS_AS_ANONYM } from 'app/shared/constants/collection'
import { DESC } from 'app/shared/constants/order'
import { Post } from 'app/shared/firestore/types/post'
import { useCache } from 'app/shared/hooks/useCache'
import { px } from 'app/shared/styles/px'
import { firestore } from 'firebase/app'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'

const RouteHome: FunctionComponent = () => {
  const classes = useStyles({})
  const [cache, setCache] = useCache(window.location.pathname)
  const [limit, setLimit] = useState<number>(cache.limit)
  const [inProgress, setInProgress] = useState(cache.posts.length === 0)
  const [inProgressMore, setInProgressMore] = useState(false)
  const [posts, setPosts] = useState<Post[]>(cache.posts)
  const subscribePosts = (_limit = 16) => {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .limit(_limit)
      .orderBy('createdAt', DESC)
    return collectionData<Post>(query).subscribe(_posts => {
      setPosts(_posts)
      setInProgress(false)
      setInProgressMore(false)
    })
  }
  const onMore = () => {
    if (inProgressMore) {
      return
    }
    setInProgressMore(true)
    setLimit(limit + 16)
  }

  useEffect(() => {
    const posts$ = subscribePosts(limit)
    return () => {
      posts$.unsubscribe()
    }
  }, [limit])

  useEffect(() => {
    return () => {
      setCache({ posts, limit })
    }
  }, [limit, posts, setCache])

  return (
    <Fragment>
      <FragmentHead />
      <Header />
      <main className={classes.root}>
        <SectionTitle
          title={'スイミーにようこそ'}
          description={`スイミーは完全な匿名の電子掲示板です。
          ログインすることでSNSのような機能が使えたりもします。`}
        />
        <TextFieldPost />
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <section className={classes.section}>
              <ul className={classes.posts}>
                {posts.map((post, index) => (
                  <li key={post.id}>
                    <CardPost post={post} />
                    <Divider />
                  </li>
                ))}
              </ul>
              {limit < 120 && (
                <ButtonMore onClick={onMore} inProgress={inProgressMore} />
              )}
            </section>
          </Fade>
        )}
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    posts: { display: 'grid', margin: 0, paddingLeft: 0 },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10)
    },
    root: { display: 'grid' },
    section: { display: 'grid', gridRowGap: px(spacing(2)) }
  }
})

export default RouteHome
