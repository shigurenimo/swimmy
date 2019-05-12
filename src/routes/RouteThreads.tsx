import { CircularProgress, Fade, Tab, Tabs, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { collectionData } from 'rxfire/firestore'
import ButtonMore from '../components/ButtonMore'
import CardThread from '../components/CardThread'
import Head from '../components/Head'
import Header from '../components/Header'
import SectionTitle from '../components/SectionTitle'
import { POSTS_AS_THREAD } from '../constants/collection'
import { DESC } from '../constants/order'
import { getOrderBy } from '../helpers/getOrderBy'
import { useCache } from '../hooks/useCache'
import { px } from '../libs/px'
import { Post } from '../types/models/post'

type Props = RouteComponentProps

const RouteThreads: FunctionComponent<Props> = ({ location, history }) => {
  const classes = useStyles({})
  const [cache, setCache] = useCache(location.pathname + location.search)
  const [limit, setLimit] = useState(cache.limit)
  const [inProgress, setInProgress] = useState(cache.posts.length === 0)
  const [inProgressMore, setInProgressMore] = useState(false)
  const [orderBy, setOrderBy] = useState(getOrderBy())
  const [posts, setPosts] = useState<Post[]>(cache.posts)
  const onChangeTab = (_: any, _orderBy: string) => {
    history.push(`?order=${_orderBy}`)
    setOrderBy(_orderBy)
    setInProgress(true)
  }
  const subscribePosts = (_orderBy: string, _limit = 16) => {
    const query = firestore()
      .collection(POSTS_AS_THREAD)
      .limit(_limit)
      .orderBy(_orderBy, DESC)
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
    const posts$ = subscribePosts(orderBy, limit)
    return () => {
      posts$.unsubscribe()
    }
  }, [limit, orderBy])

  useEffect(() => {
    return () => setCache({ posts, limit })
  }, [limit, posts, setCache])

  return (
    <Fragment>
      <Head title={'レスのある書き込み一覧です'} />
      <Header />
      <main className={classes.root}>
        <SectionTitle
          title={'スレッド'}
          description={'レスのある書き込みはこのページで確認できます。'}
        />
        <Tabs
          indicatorColor={'primary'}
          onChange={onChangeTab}
          textColor={'primary'}
          value={orderBy}
        >
          <Tab label={'新着'} value={'createdAt'} />
          <Tab label={'評価数'} value={'likeCount'} />
          <Tab label={'レス数'} value={'replyPostCount'} />
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
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    posts: {
      display: 'grid',
      gridRowGap: px(spacing(2)),
      marginLeft: spacing(2),
      marginRight: spacing(2)
    },
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

export default RouteThreads
