import { CircularProgress, Divider, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Header from 'app/shared/components/AppBarDefault'
import FragmentHead from 'app/shared/components/FragmentHead'
import ListItemPost from 'app/shared/components/ListItemPost'
import SectionTitle from 'app/shared/components/SectionTitle'
import TextFieldPost from 'app/shared/components/TextFieldPost'
import { POSTS, POSTS_AS_ANONYM } from 'app/shared/constants/collection'
import { DESC } from 'app/shared/constants/order'
import { Post } from 'app/shared/firestore/types/post'
import { toDateText } from 'app/shared/helpers/toDateText'
import { px } from 'app/shared/styles/px'
import { firestore } from 'firebase/app'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { collectionData, docData } from 'rxfire/firestore'
import { take } from 'rxjs/operators'

type Props = RouteComponentProps<{ threadId: string }>

const RouteThread: FunctionComponent<Props> = ({ match }) => {
  const [loadingPosts, setLoadingPosts] = useState(true)

  const [loadingPost, setLoadingPost] = useState(true)

  const [posts, setPosts] = useState<Post[]>([])

  const [thread, setThread] = useState<Post | null>(null)

  const classes = useStyles({})

  useEffect(() => {
    const subscription = collectionData<Post>(
      firestore()
        .collection(POSTS_AS_ANONYM)
        .doc(match.params.threadId)
        .collection(POSTS)
        .limit(120)
        .orderBy('createdAt', DESC)
    ).subscribe(_posts => {
      setPosts(_posts)
      setLoadingPosts(false)
    })
    return () => subscription.unsubscribe()
  }, [match.params.threadId])

  useEffect(() => {
    const subscription = docData<Post>(
      firestore()
        .collection(POSTS_AS_ANONYM)
        .doc(match.params.threadId)
    )
      .pipe(take(2))
      .subscribe(_thread => {
        setThread(_thread)
        setLoadingPost(false)
      })
    return () => subscription.unsubscribe()
  }, [match.params.threadId])

  const inProgress = loadingPosts || loadingPost

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
      <main>
        <SectionTitle
          title={'スレッド'}
          description={
            '書き込みとそれに対するレスが表示されています。このページの右上のアイコンから前のページに戻ることができます。'
          }
        />
        <TextFieldPost replyPostId={match.params.threadId} />
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <div>
            {posts.map((post, index) => (
              <Fragment key={post.id}>
                <ListItemPost index={posts.length - index} post={post} />
                <Divider />
              </Fragment>
            ))}
            {thread && <ListItemPost index={0} post={thread} />}
          </div>
        )}
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
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

export default RouteThread
