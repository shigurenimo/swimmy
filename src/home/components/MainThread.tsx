import { Divider, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import CardPostResponse from './CardPostResponse'
import CardPostThread from './CardPostThread'
import TextFieldResponse from '../../thread/components/TextFieldResponse'
import CardPostSkeleton from '../../skeleton/CardPostSkeleton'
import { useThreadPost } from '../hooks/useThreadPost'
import { useThreadPosts } from '../hooks/useThreadPosts'

const MainThread: FunctionComponent = () => {
  const { threadId } = useParams<{ threadId: string }>()

  const [posts, loadingPosts] = useThreadPosts(threadId)

  const [thread, loadingThread] = useThreadPost(threadId)

  const classes = useStyles()

  const loading = loadingPosts || loadingThread

  return (
    <main className={classes.main}>
      {!loading && (
        <ul>
          {thread && (
            <li>
              <CardPostThread post={thread} />
              <Divider />
            </li>
          )}
          {posts.map((post, index) => (
            <li key={post.id}>
              <CardPostResponse index={index + 1} post={post} />
              <Divider />
            </li>
          ))}
        </ul>
      )}
      {loading && (
        <ul>
          {[0, 1, 2].map(n => (
            <li key={n}>
              <CardPostSkeleton />
              <Divider />
            </li>
          ))}
        </ul>
      )}
      {<TextFieldResponse threadId={threadId} />}
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
