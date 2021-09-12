import { Divider, Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import { FragmentHead } from 'src/core/components/FragmentHead'
import { useAnalytics } from 'src/core/hooks/useAnalytics'
import { toThreadDescription } from 'src/core/utils/toThreadDescription'
import { DivResponse } from 'src/home/components/DivResponse'
import { DivThread } from 'src/home/components/DivThread'
import { MainThreadNotFound } from 'src/home/components/MainThreadNotFound'
import { DivSkeleton } from 'src/post/DivSkeleton'
import { TextFieldResponse } from 'src/thread/components/TextFieldResponse'
import { useResponseList } from 'src/thread/hooks/useResponseList'
import { useThread } from 'src/thread/hooks/useThread'

export const MainThread: FunctionComponent = () => {
  useAnalytics()

  const { threadId } = useParams<{ threadId: string }>()

  const responseList = useResponseList(threadId)

  const thread = useThread(threadId)

  const classes = useStyles()

  const isLoading = responseList.isLoading || thread.isLoading

  const skeletons = isLoading ? [0, 1, 2, 3] : []

  return (
    <main className={classes.main}>
      {thread.data && (
        <FragmentHead
          title={`「${thread.data?.text}」`}
          description={toThreadDescription(thread.data)}
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
        {!isLoading && !thread && <MainThreadNotFound />}
        {!isLoading && thread.data && (
          <li>
            <DivThread post={thread.data} />
            <Divider />
          </li>
        )}
        {!isLoading &&
          responseList.data?.map((post, index) => (
            <Fragment key={post.id}>
              <DivResponse index={index + 1} post={post} />
              <Divider />
            </Fragment>
          ))}
      </ul>
      {!isLoading && thread !== null && (
        <TextFieldResponse threadId={threadId} />
      )}
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
