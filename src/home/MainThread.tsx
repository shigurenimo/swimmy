import { Divider, Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { Fragment, FunctionComponent } from 'react'
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router-dom'
import { POSTS, POSTS_AS_ANONYM } from '../firestore/constants/collection'
import { ASC } from '../firestore/constants/order'
import { Post } from '../firestore/types/post'
import DivSkeleton from '../skeleton/DivSkeleton'
import { toThreadDescription } from '../text/toThreadDescription'
import TextFieldResponse from '../thread/components/TextFieldResponse'
import FragmentHead from '../web/FragmentHead'
import { useAnalytics } from '../web/useAnalytics'
import DivResponse from './components/DivResponse'
import DivThread from './components/DivThread'
import MainThreadNotFound from './components/MainThreadNotFound'

const MainThread: FunctionComponent = () => {
  const { threadId } = useParams<{ threadId: string }>()

  const [posts = [], loadingPosts] = useCollectionData<Post>(
    firestore()
      .collection(POSTS_AS_ANONYM)
      .doc(threadId)
      .collection(POSTS)
      .limit(120)
      .orderBy('createdAt', ASC)
  )

  const [thread = null, loadingThread] = useDocumentData<Post>(
    firestore()
      .collection(POSTS_AS_ANONYM)
      .doc(threadId)
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
        {skeletons.map(n => (
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

export default MainThread
