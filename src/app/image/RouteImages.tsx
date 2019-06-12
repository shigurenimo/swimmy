import { CircularProgress, Fade, Tab, Tabs, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Header from 'app/shared/components/AppBarDefault'
import ButtonMore from 'app/shared/components/ButtonMore'
import FragmentHead from 'app/shared/components/FragmentHead'
import SectionTitle from 'app/shared/components/SectionTitle'
import { POSTS_AS_IMAGE } from 'app/shared/constants/collection'
import { DESC } from 'app/shared/constants/order'
import { Post } from 'app/shared/firestore/types/post'
import { getOrderBy } from 'app/shared/helpers/getOrderBy'
import { useCache } from 'app/shared/hooks/useCache'
import { px } from 'app/shared/styles/px'
import { resetList } from 'app/shared/styles/resetList'
import { firestore } from 'firebase/app'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { collectionData } from 'rxfire/firestore'
import CardImage from './components/CardImage'

type Props = RouteComponentProps

const RouteImages: FunctionComponent<Props> = ({ location, history }) => {
  const classes = useStyles({})
  const [cache, setCache] = useCache(location.pathname + location.search)
  const [limit, setLimit] = useState(cache.limit)
  const [inProgress, setInProgress] = useState(cache.posts.length === 0)
  const [inProgressMore, setInProgressMore] = useState(false)
  const [orderBy, setOrderBy] = useState(getOrderBy())
  const [posts, setPosts] = useState<Post[]>(cache.posts)
  const onChangeTab = (_: any, _orderBy: string) => {
    history.push(`?order=${orderBy}`)
    setOrderBy(_orderBy)
    setInProgress(true)
  }
  const subscribePosts = (_orderBy: string, _limit = 16) => {
    const query = firestore()
      .collection(POSTS_AS_IMAGE)
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
    return () => {
      setCache({ posts, limit })
    }
  }, [limit, posts, setCache])

  return (
    <Fragment>
      <FragmentHead
        title={'フォトグラフィ'}
        description={'画像の添付された書き込みです。'}
      />
      <Header />
      <main className={classes.root}>
        <SectionTitle
          title={'フォトグラフィ'}
          description={'画像の添付された書き込みはここに表示されます。'}
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
              <ul className={classes.ul}>
                {posts.map(post => (
                  <li key={post.id}>
                    <CardImage post={post} />
                  </li>
                ))}
              </ul>
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

const useStyles = makeStyles<Theme>(({ breakpoints, spacing }) => {
  return {
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10)
    },
    root: { display: 'grid', gridRowGap: px(spacing(2)) },
    section: { display: 'grid', gridRowGap: px(spacing(2)) },
    ul: {
      ...resetList(),
      alignItems: 'center',
      display: 'grid',
      gridColumnGap: px(spacing(2)),
      gridRowGap: px(spacing(2)),
      margin: 0,
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      [breakpoints.up('xs')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
      [breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(3, 1fr)' },
      [breakpoints.up('md')]: { gridTemplateColumns: 'repeat(5, 1fr)' },
      [breakpoints.up('lg')]: { gridTemplateColumns: 'repeat(7, 1fr)' }
    }
  }
})

export default RouteImages
