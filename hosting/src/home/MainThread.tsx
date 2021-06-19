import { Divider, Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import firebase from 'firebase/app'
import React, { Fragment, FunctionComponent } from 'react'
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router-dom'
import { FragmentHead } from 'src/core/components/FragmentHead'
import { FEEDS, RESPONSES, THREADS } from 'src/core/constants/collection'
import { ASC } from 'src/core/constants/order'
import { useAnalytics } from 'src/core/hooks/useAnalytics'
import { Post } from 'src/core/types/post'
import { toThreadDescription } from 'src/core/utils/toThreadDescription'
import { DivResponse } from 'src/home/components/DivResponse'
import { DivThread } from 'src/home/components/DivThread'
import { MainThreadNotFound } from 'src/home/components/MainThreadNotFound'
import { DivSkeleton } from 'src/post/DivSkeleton'
import { TextFieldResponse } from 'src/thread/components/TextFieldResponse'

export const MainThread: FunctionComponent = () => {
  const { threadId } = useParams<{ threadId: string }>()

  const [posts = [], loadingPosts] = useCollectionData<Post>(
    firebase
      .firestore()
      .collection(THREADS)
      .doc(threadId)
      .collection(RESPONSES)
      .limit(120)
      .orderBy('createdAt', ASC)
  )

  const [thread = null, loadingThread] = useDocumentData<Post>(
    firebase.firestore().collection(FEEDS).doc(threadId)
  )

  const classes = useStyles()

  useAnalytics()

  const loading = loadingPosts || loadingThread

  const skeletons = loading ? [0, 1, 2, 3] : []

  return (
    <main className={classes.main}>
      {thread !== null && (
        <FragmentHead
          title={`「${thread?.text}」`}
          description={toThreadDescription(thread)}
        />
      )}
      <Toolbar />
      <ul>
        {skeletons.map((n) => (
          <li key={n}>
            <DivSkeleton />
            <Divider />
          </li>
        ))}
        {!loading && thread === null && <MainThreadNotFound />}
        {!loading && thread !== null && (
          <li>
            <DivThread post={thread} />
            <Divider />
          </li>
        )}
        {!loading &&
          posts.map((post, index) => (
            <Fragment key={post.id}>
              <DivResponse index={index + 1} post={post} />
              <Divider />
            </Fragment>
          ))}
      </ul>
      {!loading && thread !== null && <TextFieldResponse threadId={threadId} />}
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    main: { display: 'grid', gridRowGap: spacing(2) },
    posts: {
      display: 'grid',
      gridRowGap: spacing(2),
      marginLeft: spacing(2),
      marginRight: spacing(2),
      marginTop: spacing(2),
    },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10),
    },
  }
})
