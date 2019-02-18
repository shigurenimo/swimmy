import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Fade from '@material-ui/core/Fade'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { collectionData, docData } from 'rxfire/firestore'
import { take } from 'rxjs/operators'
import ListItemPost from '../components/ListItemPost'
import ViewTitle from '../components/ViewTitle'
import TextFieldPost from '../components/TextFieldPost'
import { POSTS, POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import { useSubscription } from '../hooks/useSubscription'
import { Post } from '../interfaces/models/post'
import { PostUi } from '../interfaces/models/postUi'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

type Props = RouteComponentProps

const RouteThread: FunctionComponent<Props> = ({ match }) => {
  const [inProgressPosts, setInProgressPosts] = useState(true)
  const [inProgressThread, setInProgressThread] = useState(true)
  const [posts, setPosts] = useState<PostUi[]>([])
  const [thread, setThread] = useState<PostUi | null>(null)
  const classes = useStyles({})
  const subscribePosts = () => {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .doc((match.params as any).threadId)
      .collection(POSTS)
      .limit(120)
      .orderBy('createdAt', DESC)
    return collectionData<Post>(query).subscribe(docs => {
      const _posts = docs.map(doc => {
        return { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
      })
      setPosts(_posts)
      setInProgressPosts(false)
    })
  }
  const subscribeThread = () => {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .doc((match.params as any).threadId)
    return docData<Post>(query)
      .pipe(take(2))
      .subscribe(doc => {
        const _thread = { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
        setThread(_thread)
        setInProgressThread(false)
      })
  }
  const inProgress = inProgressPosts || inProgressThread

  useEffect(() => {
    const posts$$ = subscribePosts()
    const threads$$ = subscribeThread()
    return () => {
      posts$$.unsubscribe()
      threads$$.unsubscribe()
    }
  }, [])

  if (inProgress) {
    return <CircularProgress className={classes.progress} />
  }

  return (
    <main>
      <ViewTitle
        title={'スレッド'}
        description={`書き込みとそれに対するレスが表示されています。このページの右上のアイコンから前のページに戻ることができます。`}
      />
      <TextFieldPost replyPostId={(match.params as any).threadId} />
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
    </main>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    posts: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      marginLeft: spacing.unit * 2,
      marginRight: spacing.unit * 2,
      marginTop: spacing.unit * 2
    },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing.unit * 10
    }
  }
})

export default RouteThread
