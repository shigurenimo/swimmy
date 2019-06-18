import { CircularProgress, Divider, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Header from 'app/shared/components/AppBarDefault'
import FragmentHead from 'app/shared/components/FragmentHead'
import ListItemPost from 'app/shared/components/ListItemPost'
import TextFieldResponse from 'app/shared/components/TextFieldResponse'
import { POSTS, POSTS_AS_ANONYM } from 'app/shared/constants/collection'
import { ASC } from 'app/shared/constants/order'
import { Post } from 'app/shared/firestore/types/post'
import { toDateText } from 'app/shared/helpers/toDateText'
import { px } from 'app/shared/styles/px'
import { resetList } from 'app/shared/styles/resetList'
import { firestore } from 'firebase/app'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { collectionData, docData } from 'rxfire/firestore'
import { take } from 'rxjs/operators'

type Props = RouteComponentProps<{ threadId: string }>

const RouteThread: FunctionComponent<Props> = ({
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
    const subscription = docData<Post>(
      firestore()
        .collection(POSTS_AS_ANONYM)
        .doc(threadId)
    )
      .pipe(take(2))
      .subscribe(_thread => {
        setThread(_thread)
        setLoadingPost(false)
      })
    return () => subscription.unsubscribe()
  }, [threadId])

  const loading = loadingPosts || loadingPost

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
      <main className={classes.main}>
        {loading && <CircularProgress className={classes.progress} />}
        <ul className={classes.ul}>
          {thread && (
            <li>
              <ListItemPost index={0} post={thread} />
              <Divider />
            </li>
          )}
          {posts.map((post, index) => (
            <li key={post.id}>
              <ListItemPost index={index + 1} post={post} />
              <Divider />
            </li>
          ))}
        </ul>
        {!loading && <TextFieldResponse threadId={threadId} />}
      </main>
    </Fragment>
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
    },
    ul: { ...resetList() }
  }
})

export default RouteThread
