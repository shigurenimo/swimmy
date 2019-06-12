import { CircularProgress, Divider, Fade, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Header from 'app/shared/components/AppBarDefault'
import FragmentHead from 'app/shared/components/FragmentHead'
import ListItemPost from 'app/shared/components/ListItemPost'
import SectionTitle from 'app/shared/components/SectionTitle'
import TextFieldPost from 'app/shared/components/TextFieldPost'
import { POSTS, POSTS_AS_ANONYM } from 'app/shared/constants/collection'
import { DESC } from 'app/shared/constants/order'
import { Post } from 'app/shared/firestore/types/post'
import { toDateText } from 'app/shared/helpers/toDateText'
import { px } from 'app/shared/styles/px'
import { firestore } from 'firebase/app'
import React, {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { collectionData, docData } from 'rxfire/firestore'
import { take } from 'rxjs/operators'

type Props = RouteComponentProps<{ threadId: string }>

const RouteThread: FunctionComponent<Props> = ({ match }) => {
  const [inProgressPosts, setInProgressPosts] = useState(true)
  const [inProgressThread, setInProgressThread] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [thread, setThread] = useState<Post | null>(null)
  const classes = useStyles({})
  const subscribePosts = useCallback(() => {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .doc(match.params.threadId)
      .collection(POSTS)
      .limit(120)
      .orderBy('createdAt', DESC)
    return collectionData<Post>(query).subscribe(_posts => {
      setPosts(_posts)
      setInProgressPosts(false)
    })
  }, [match.params.threadId])
  const subscribeThread = useCallback(() => {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .doc((match.params as any).threadId)
    return docData<Post>(query)
      .pipe(take(2))
      .subscribe(_thread => {
        setThread(_thread)
        setInProgressThread(false)
      })
  }, [match.params])

  const inProgress = inProgressPosts || inProgressThread

  useEffect(() => {
    const subscription = subscribePosts()
    return () => subscription.unsubscribe()
  }, [subscribePosts])

  useEffect(() => {
    const subscription = subscribeThread()
    return () => subscription.unsubscribe()
  }, [subscribeThread])

  return (
    <Fragment>
      {thread ? (
        <FragmentHead
          title={thread.text}
          description={toDateText(thread.createdAt)}
        />
      ) : (
        <FragmentHead title={'読み込み中'} />
      )}
      <Header isClose={true} />
      <main>
        <SectionTitle
          title={'スレッド'}
          description={
            '書き込みとそれに対するレスが表示されています。このページの右上のアイコンから前のページに戻ることができます。'
          }
        />
        <TextFieldPost replyPostId={match.params.threadId} />
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <div>
              {posts.map(post => (
                <Fragment key={post.id}>
                  <ListItemPost post={post} />
                  <Divider />
                </Fragment>
              ))}
              {thread && <ListItemPost post={thread} />}
            </div>
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
      marginRight: spacing(2),
      marginTop: spacing(2)
    },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10)
    }
  }
})

export default RouteThread
