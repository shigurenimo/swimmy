import { CircularProgress, Tab, Tabs, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { collectionData } from 'rxfire/firestore'
import Header from '../components/AppBarDefault'
import ButtonMore from '../components/ButtonMore'
import FragmentHead from '../components/FragmentHead'
import { WORD_PHOTO, WORD_RESPONSE } from '../constants/word'
import { POSTS_AS_IMAGE } from '../firestore/constants/collection'
import { DESC } from '../firestore/constants/order'
import { Post } from '../firestore/types/post'
import { getOrderBy } from '../helpers/getOrderBy'
import { useCollectionState } from '../hooks/useCollectionState'
import { px } from '../styles/px'
import { resetList } from '../styles/resetList'
import CardImage from './components/CardImage'

const RouteImages: FunctionComponent = () => {
  const location = useLocation()

  const history = useHistory()

  const key = `${location.pathname}${location.search}`

  const [__posts, __limit, setState] = useCollectionState<Post>(key)

  const [posts, setPosts] = useState(__posts)

  const [limit, setLimit] = useState(__limit)

  const [orderBy, setOrderBy] = useState(getOrderBy())

  const [loading, setLoading] = useState(__posts.length === 0)

  const [loadingMore, setLoadingMore] = useState(false)

  const classes = useStyles({})

  useEffect(() => {
    const subscription = collectionData<Post>(
      firestore()
        .collection(POSTS_AS_IMAGE)
        .limit(limit)
        .orderBy(orderBy, DESC)
    ).subscribe(_posts => {
      setPosts(_posts)
      setLoading(false)
      setLoadingMore(false)
    })
    return () => subscription.unsubscribe()
  }, [limit, orderBy])

  useEffect(() => {
    return () => setState(posts, limit)
  }, [limit, posts, setState])

  const onMore = useCallback(() => {
    if (loadingMore) return
    setLoadingMore(true)
    setLimit(_limit => _limit + 16)
  }, [loadingMore])

  const onChangeTab = useCallback(
    (_: ChangeEvent<{}>, _orderBy: string) => {
      history.push(`?order=${_orderBy}`)
      setOrderBy(_orderBy)
      setLoading(true)
    },
    [history]
  )

  return (
    <Fragment>
      <FragmentHead
        title={WORD_PHOTO}
        description={`${WORD_PHOTO}の添付された書き込みです。`}
      />
      <Header />
      <main className={classes.root}>
        <Tabs
          indicatorColor={'primary'}
          onChange={onChangeTab}
          textColor={'primary'}
          value={orderBy}
        >
          <Tab label={'新着'} value={'createdAt'} />
          <Tab label={'評価数'} value={'likeCount'} />
          <Tab label={`${WORD_RESPONSE}数`} value={'replyPostCount'} />
        </Tabs>
        {loading && <CircularProgress className={classes.progress} />}
        {!loading && (
          <section className={classes.section}>
            <ul className={classes.ul}>
              {posts.map(post => (
                <li key={post.id}>
                  <CardImage post={post} />
                </li>
              ))}
            </ul>
            {limit < 200 && (
              <ButtonMore onClick={onMore} inProgress={loadingMore} />
            )}
          </section>
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
