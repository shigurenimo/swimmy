import { CircularProgress, Divider, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { collectionData } from 'rxfire/firestore'
import ButtonMore from '../../components/ButtonMore'
import TextFieldPost from '../../components/TextFieldPost'
import { POSTS_AS_ANONYM } from '../../firestore/constants/collection'
import { DESC } from '../../firestore/constants/order'
import { Post } from '../../firestore/types/post'
import { useCollectionState } from '../../hooks/useCollectionState'
import { px } from '../../styles/px'
import CardPost from './CardPost'

const MainHome: FunctionComponent = () => {
  const location = useLocation()

  const key = location.pathname

  const [__posts, __limit, setState] = useCollectionState<Post>(key)

  const [posts, setPosts] = useState(__posts)

  const [limit, setLimit] = useState(__limit)

  const [loading, setLoading] = useState(__posts.length === 0)

  const [loadingMore, setLoadingMore] = useState(false)

  const classes = useStyles({})

  useEffect(() => {
    const subscription = collectionData<Post>(
      firestore()
        .collection(POSTS_AS_ANONYM)
        .limit(limit)
        .orderBy('createdAt', DESC)
    ).subscribe(_posts => {
      setPosts(_posts)
      setLoading(false)
      setLoadingMore(false)
    })
    return () => subscription.unsubscribe()
  }, [limit])

  useEffect(() => {
    return () => setState(posts, limit)
  }, [limit, posts, setState])

  const onLoadMore = useCallback(() => {
    if (loadingMore) return
    setLoadingMore(true)
    setLimit(_limit => _limit + 16)
  }, [loadingMore])

  return (
    <main className={classes.main}>
      <TextFieldPost />
      {loading && <CircularProgress className={classes.progress} />}
      {!loading && (
        <section className={classes.section}>
          <ul className={classes.posts}>
            {posts.map((post, index) => (
              <li key={post.id}>
                <CardPost post={post} />
                <Divider />
              </li>
            ))}
          </ul>
          {limit < 400 && (
            <ButtonMore onClick={onLoadMore} inProgress={loadingMore} />
          )}
        </section>
      )}
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    posts: { display: 'grid', margin: 0, paddingLeft: 0 },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10),
    },
    main: { display: 'grid' },
    section: { display: 'grid', gridRowGap: px(spacing(2)) },
  }
})

export default MainHome
