import { Divider, Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import DivSkeleton from '../skeleton/DivSkeleton'
import TextFieldResponse from '../thread/components/TextFieldResponse'
import FragmentHead from '../web/FragmentHead'
import { useAnalytics } from '../web/useAnalytics'
import DivResponse from './components/DivResponse'
import DivThread from './components/DivThread'
import { useThread } from './hooks/useThread'
import { useResponses } from './hooks/useResponses'

const MainThread: FunctionComponent = () => {
  const { threadId } = useParams<{ threadId: string }>()

  const [posts, loadingPosts] = useResponses(threadId)

  const [thread, loadingThread] = useThread(threadId)

  const classes = useStyles()

  useAnalytics()

  const loading = loadingPosts || loadingThread

  const skeletons = loading ? [0, 1, 2, 3] : []

  return (
    <main className={classes.main}>
      <FragmentHead title={thread?.id} description={thread?.text} />
      <Toolbar />
      <ul>
        {skeletons.map(n => (
          <li key={n}>
            <DivSkeleton />
            <Divider />
          </li>
        ))}
        {!loading && thread && (
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
      <TextFieldResponse threadId={threadId} />
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
