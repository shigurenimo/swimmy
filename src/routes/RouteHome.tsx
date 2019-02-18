import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import ButtonMore from '../components/ButtonMore'
import ExpansionPanelPost from '../components/ExpansionPanelPost'
import TextFieldPost from '../components/TextFieldPost'
import ViewTitle from '../components/ViewTitle'
import { POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import { createdAt } from '../helpers/createdAt'
import { useCache } from '../hooks/useCache'
import { useSubscription } from '../hooks/useSubscription'
import { Post } from '../interfaces/models/post'
import { PostUi } from '../interfaces/models/postUi'
import { px } from '../libs/styles/px'

const RouteHome: FunctionComponent = () => {
  const classes = useStyles({})
  const [inProgress, setInProgress] = useState(true)
  const [inProgressMore, setInProgressMore] = useState(false)
  const [limit, setLimit] = useState(16)
  const [orderBy, setOrderBy] = useState('createdAt')
  const [posts, setPosts] = useState<PostUi[]>([])
  const [subscription, setSubscription] = useSubscription()
  const [cache, setCache] = useCache(location.pathname)
  const subscribePosts = (_limit = 16) => {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .limit(_limit)
      .orderBy('createdAt', DESC)
    return collectionData<Post>(query).subscribe(docs => {
      const _posts = docs.map(doc => {
        return { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
      })
      setPosts(_posts)
      setInProgress(false)
      setInProgressMore(false)
    })
  }
  const restoreState = () => {
    if (cache) {
      setInProgress(false)
      setLimit(cache.limit)
      setPosts(cache.posts)
    }
  }
  const saveState = () => {
    setCache({ posts, limit })
  }
  const onMore = () => {
    if (inProgressMore) {
      return
    }
    const _limit = limit + 16
    setInProgressMore(true)
    setLimit(_limit)
    const _subscription = subscribePosts(_limit)
    setSubscription(_subscription)
  }

  useEffect(() => {
    restoreState()
    const _limit = cache ? cache.limit : 16
    const _subscription = subscribePosts(_limit)
    setSubscription(_subscription)
    return () => {
      subscription.unsubscribe()
      saveState()
    }
  }, [])

  return (
    <main className={classes.root}>
      <ViewTitle
        title={'スイミーにようこそ'}
        description={`はじめまして。スイミーは完全な匿名の電子掲示板です。
          ログインすることでSNSの真似事ができますが、SNSではないです。`}
      />
      <TextFieldPost />
      {inProgress && <CircularProgress className={classes.progress} />}
      {!inProgress && (
        <Fade in>
          <section className={classes.section}>
            <ul className={classes.posts}>
              {posts.map(post => (
                <ExpansionPanelPost key={post.id} post={post} />
              ))}
            </ul>
            {limit < 120 && (
              <ButtonMore onClick={onMore} inProgress={inProgressMore} />
            )}
          </section>
        </Fade>
      )}
    </main>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    posts: { display: 'grid', margin: 0, paddingLeft: 0 },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing.unit * 10
    },
    root: { display: 'grid' },
    section: { display: 'grid', gridRowGap: px(spacing.unit * 2) }
  }
})

export default RouteHome
