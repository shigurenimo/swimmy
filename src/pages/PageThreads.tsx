import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { collectionData } from 'rxfire/firestore'
import ButtonMore from '../components/ButtonMore'
import CardThread from '../components/CardThread'
import PageTitle from '../components/PageTitle'
import { POSTS_AS_THREAD } from '../constants/collection'
import { DESC } from '../constants/order'
import { useCache } from '../hooks/useCache'
import { useSubscription } from '../hooks/useSubscription'
import { Post } from '../interfaces/models/post/post'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

type Props = RouteComponentProps

const PageThreads: FunctionComponent<Props> = ({ location, history }) => {
  const [inProgress, setInProgress] = useState(true)
  const [inProgressMore, setInProgressMore] = useState(false)
  const [limit, setLimit] = useState(16)
  const [orderBy, setOrderBy] = useState('createdAt')
  const [posts, setPosts] = useState<PostUi[]>([])
  const [subscription, setSubscription] = useSubscription()
  const classes = useStyles({})
  const [cache, setCache] = useCache(location.pathname + location.search)
  const onChangeTab = (_: any, _orderBy: string) => {
    history.push(`?order=${_orderBy}`)
    const _subscription = subscribePosts(_orderBy)
    setSubscription(_subscription)
    setOrderBy(_orderBy)
    setInProgress(true)
    saveState()
  }
  const subscribePosts = (_orderBy: string, _limit = 16) => {
    const query = firestore()
      .collection(POSTS_AS_THREAD)
      .limit(_limit)
      .orderBy(_orderBy, DESC)
    return collectionData<Post>(query).subscribe(docs => {
      const _posts = docs.map(doc => {
        return { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
      })
      setPosts(_posts)
      setInProgress(false)
      setInProgressMore(false)
    })
  }
  const getOrderBy = () => {
    switch (location.search.replace('?order=', '')) {
      case 'createdAt':
        return 'createdAt'
      case 'likeCount':
        return 'likeCount'
      case 'replyPostCount':
        return 'replyPostCount'
      default:
        return 'createdAt'
    }
  }
  const saveState = () => {
    setCache({ posts, limit })
  }
  const restoreState = () => {
    if (cache) {
      setInProgress(false)
      setLimit(cache.limit)
      setPosts(cache.posts)
    }
  }
  const onMore = () => {
    if (inProgressMore) {
      return
    }
    const _limit = limit + 16
    setInProgressMore(true)
    setLimit(_limit)
    const _subscription = subscribePosts(orderBy, _limit)
    setSubscription(_subscription)
  }

  useEffect(() => {
    const _orderBy = getOrderBy()
    restoreState()
    const _limit = cache ? cache.limit : 40
    setOrderBy(_orderBy)
    const _subscription = subscribePosts(_orderBy, _limit)
    setSubscription(_subscription)
    return () => {
      subscription.unsubscribe()
      saveState()
    }
  }, [])

  return (
    <main className={classes.root}>
      <PageTitle
        title={'スレッド'}
        description={'レスのある書き込みはこのページで確認できます。'}
      />
      <Tabs
        indicatorColor={'primary'}
        onChange={onChangeTab}
        textColor={'primary'}
        value={orderBy}
      >
        <Tab label="新着" value={'createdAt'} />
        <Tab label="評価数" value={'likeCount'} />
        <Tab label="レス数" value={'replyPostCount'} />
      </Tabs>
      {inProgress && <CircularProgress className={classes.progress} />}
      {!inProgress && (
        <Fade in>
          <section className={classes.section}>
            <div className={classes.posts}>
              {posts.map(post => (
                <CardThread key={post.id} post={post} />
              ))}
            </div>
            {limit < 200 && (
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
    posts: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      marginLeft: spacing.unit * 2,
      marginRight: spacing.unit * 2
    },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing.unit * 10
    },
    root: { display: 'grid', gridRowGap: px(spacing.unit * 2) },
    section: { display: 'grid', gridRowGap: px(spacing.unit * 2) }
  }
})

export default PageThreads
