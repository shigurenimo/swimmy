import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { POSTS, POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import { useSubscription } from '../hooks/useSubscription'
import { Post } from '../interfaces/models/post/post'
import { pct } from '../libs/styles/pct'

interface Props {
  postId: string
  replyPostCount: number
}

const ListReplyPost: FunctionComponent<Props> = ({
  postId,
  replyPostCount
}) => {
  const [posts, setPosts] = useState<Post[]>([])

  const [inProgress, setInProgress] = useState(replyPostCount > 0)

  const classes = useStyles({})

  const [subscription, setSubscription] = useSubscription()

  const componentDidMount = () => {
    setTimeout(
      () => {
        const query = firestore()
          .collection(POSTS_AS_ANONYM)
          .doc(postId)
          .collection(POSTS)
          .limit(24)
          .orderBy('createdAt', DESC)
        const _subscription = collectionData(query).subscribe((docs: any) => {
          docs.reverse()
          setPosts(docs)
          setInProgress(false)
        })
        setSubscription(_subscription)
      },
      replyPostCount > 0 ? 400 : 0
    )
  }

  const componentWillUnmount = () => {
    subscription.unsubscribe()
  }

  useEffect(() => {
    componentDidMount()
    return () => componentWillUnmount()
  }, [])

  if (inProgress) {
    return (
      <div className={classes.progress}>
        <CircularProgress />
      </div>
    )
  }

  if (!posts.length) {
    return null
  }

  return (
    <Fade in>
      <List className={classes.root}>
        {posts.map(post => (
          <ListItem key={post.id} button>
            <ListItemText>{post.text}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Fade>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    progress: { marginTop: spacing.unit * 2, textAlign: 'center' },
    root: { width: pct(100) }
  }
})

export default ListReplyPost
