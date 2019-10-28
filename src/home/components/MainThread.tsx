import { CircularProgress, Divider, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collectionData, docData } from 'rxfire/firestore'
import CardPostResponse from '../../components/CardPostResponse'
import CardPostThread from '../../components/CardPostThread'
import TextFieldResponse from '../../components/TextFieldResponse'
import { POSTS, POSTS_AS_ANONYM } from '../../firestore/constants/collection'
import { ASC } from '../../firestore/constants/order'
import { Post } from '../../firestore/types/post'
import { px } from '../../styles/px'

const MainThread: FunctionComponent = () => {
  const { threadId } = useParams<{ threadId: string }>()

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
