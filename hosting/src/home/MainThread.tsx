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
import { useAnalytics } from 'src/core/hooks/useAnalytics'
import { FEEDS, RESPONSES, THREADS } from '../core/constants/collection'
import { ASC } from '../core/constants/order'
import { Post } from '../core/types/post'
import { toThreadDescription } from '../core/utitls/toThreadDescription'
import { DivSkeleton } from '../post/DivSkeleton'
import { TextFieldResponse } from '../thread/components/TextFieldResponse'
import { DivResponse } from './components/DivResponse'
import { DivThread } from './components/DivThread'
import { MainThreadNotFound } from './components/MainThreadNotFound'

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
