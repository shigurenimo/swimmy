import { CircularProgress, Fade, Tab, Tabs } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { collectionData } from 'rxfire/firestore'
import ButtonMore from '../components/ButtonMore'
import UlImages from '../components/UlImages'
import ViewTitle from '../components/ViewTitle'
import { POSTS_AS_IMAGE } from '../constants/collection'
import { DESC } from '../constants/order'
import { createdAt } from '../helpers/createdAt'
import { useCache } from '../hooks/useCache'
import { useSubscription } from '../hooks/useSubscription'
import { Post } from '../interfaces/models/post'
import { PostUi } from '../interfaces/models/postUi'
import { px } from '../libs/styles/px'

type Props = RouteComponentProps

const RouteImages: FunctionComponent<Props> = ({ location, history }) => {
  const [inProgress, setInProgress] = useState(true)
  const [inProgressMore, setInProgressMore] = useState(false)
  const [limit, setLimit] = useState(16)
  const [orderBy, setOrderBy] = useState('createdAt')
  const [posts, setPosts] = useState<PostUi[]>([])
  const [subscription, setSubscription] = useSubscription()
  const classes = useStyles({})
  const [cache, setCache] = useCache(location.pathname + location.search)
  const onChangeTab = (_: any, _orderBy: string) => {
    history.push(`?order=${orderBy}`)
    const _subscription = subscribePosts(_orderBy)
    setSubscription(_subscription)
    setOrderBy(_orderBy)
    setInProgress(true)
    saveState()
  }
  const subscribePosts = (_orderBy: string, _limit = 16) => {
    const query = firestore()
      .collection(POSTS_AS_IMAGE)
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
      <ViewTitle
        title={'フォトグラフィ'}
        description={'画像の添付された書き込みはここに表示されます。'}
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
            <UlImages posts={posts} />
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
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10)
    },
    root: { display: 'grid', gridRowGap: px(spacing(2)) },
    section: { display: 'grid', gridRowGap: px(spacing(2)) }
  }
})

export default RouteImages
