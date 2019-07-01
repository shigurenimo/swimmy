import { CircularProgress, Divider, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import CardPostResponse from 'app/shared/components/CardPostResponse'
import CardPostThread from 'app/shared/components/CardPostThread'
import TextFieldResponse from 'app/shared/components/TextFieldResponse'
import { POSTS, POSTS_AS_ANONYM } from 'app/shared/constants/collection'
import { ASC } from 'app/shared/constants/order'
import { Post } from 'app/shared/firestore/types/post'
import { px } from 'app/shared/styles/px'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { collectionData, docData } from 'rxfire/firestore'

type Props = RouteComponentProps<{ threadId: string }>

const MainThread: FunctionComponent<Props> = ({
  match: {
    params: { threadId }
  }
}) => {
  const [loadingPosts, setLoadingPosts] = useState(true)

  const [loadingPost, setLoadingPost] = useState(true)

  const [posts, setPosts] = useState<Post[]>([])

  const [thread, setThread] = useState<Post | null>(null)

  const classes = useStyles({})

  useEffect(() => {
    setLoadingPosts(true)
    const subscription = collectionData<Post>(
      firestore()
        .collection(POSTS_AS_ANONYM)
        .doc(threadId)
        .collection(POSTS)
        .limit(120)
        .orderBy('createdAt', ASC)
    ).subscribe(_posts => {
      setPosts(_posts)
      setLoadingPosts(false)
    })
    return () => subscription.unsubscribe()
  }, [threadId])

  useEffect(() => {
    setLoadingPost(true)
    const subscription = docData<Post>(
      firestore()
        .collection(POSTS_AS_ANONYM)
        .doc(threadId)
    ).subscribe(_thread => {
      setThread(_thread)
      setLoadingPost(false)
    })
    return () => subscription.unsubscribe()
  }, [threadId])

  const loading = loadingPosts || loadingPost

  return (
    <main className={classes.main}>
      <ul>
        {!loading && thread && (
          <li>
            <CardPostThread post={thread} />
            <Divider />
          </li>
        )}
        {!loading &&
          posts.map((post, index) => (
            <li key={post.id}>
              <CardPostResponse index={index + 1} post={post} />
              <Divider />
            </li>
          ))}
      </ul>
      {loading && <CircularProgress className={classes.progress} />}
      {!loading && <TextFieldResponse threadId={threadId} />}
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    main: {
      display: 'grid',
      gridRowGap: px(spacing(2))
    },
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

export default MainThread
