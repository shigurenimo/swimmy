import { CircularProgress, Tab, Tabs, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Header from 'app/shared/components/AppBarDefault'
import ButtonMore from 'app/shared/components/ButtonMore'
import FragmentHead from 'app/shared/components/FragmentHead'
import SectionTitle from 'app/shared/components/SectionTitle'
import { POSTS_AS_THREAD } from 'app/shared/constants/collection'
import { DESC } from 'app/shared/constants/order'
import { WORD_RESPONSE, WORD_THREAD } from 'app/shared/constants/word'
import { Post } from 'app/shared/firestore/types/post'
import { getOrderBy } from 'app/shared/helpers/getOrderBy'
import { useCollectionState } from 'app/shared/hooks/useCollectionState'
import { px } from 'app/shared/styles/px'
import CardThread from 'app/thread/components/CardThread'
import { firestore } from 'firebase/app'
import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { collectionData } from 'rxfire/firestore'

type Props = RouteComponentProps

const RouteThreads: FunctionComponent<Props> = ({ location, history }) => {
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
        .collection(POSTS_AS_THREAD)
        .limit(limit)
        .orderBy(orderBy, DESC)
    ).subscribe(_posts => {
      setPosts(_posts)
      setLoading(false)
      setLoadingMore(false)
    })
    return () => subscription.unsubscribe()
  }, [limit, orderBy, posts])

  useEffect(() => {
    return () => setState(posts, limit)
  }, [limit, posts, setState])

  const onMore = useCallback(() => {
    if (loadingMore) return
    setLoadingMore(true)
    setLimit(limit + 16)
  }, [limit, loadingMore])

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
      <FragmentHead title={`${WORD_RESPONSE}のある書き込み一覧です`} />
      <Header />
      <main className={classes.root}>
        <SectionTitle
          title={WORD_THREAD}
          description={'コメントのある書き込みはこのページで確認できます。'}
        />
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
            <div className={classes.posts}>
              {posts.map(post => (
                <CardThread key={post.id} post={post} />
              ))}
            </div>
            {limit < 200 && (
              <ButtonMore onClick={onMore} inProgress={loadingMore} />
            )}
          </section>
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
