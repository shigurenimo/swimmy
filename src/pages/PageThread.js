import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { firestore } from 'firebase/app'
import React, { Fragment } from 'react'
import { collectionData, docData } from 'rxfire/firestore'
import { take } from 'rxjs/operators'
import { POSTS, POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import { ListItemPost } from '../containers/ListItemPost'
import { TextFieldPost } from '../containers/TextFieldPost'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
  isUnmounted = false
  subscription = null
  subscriptionThread = null

  state = {
    posts: [],
    thread: null,
    inProgressPosts: true,
    inProgressThread: true
  }

  render() {
    const { classes, match } = this.props
    const { posts, thread, inProgressPosts, inProgressThread } = this.state
    const inProgress = inProgressPosts || inProgressThread

    return (
      <Fragment>
        <TextFieldPost replyPostId={match.params.threadId} />
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <div>
              {posts.map((post, i) => (
                <Fragment key={post.id}>
                  <ListItemPost post={post} />
                  <Divider />
                </Fragment>
              ))}
              {thread && <ListItemPost post={thread} />}
            </div>
          </Fade>
        )}
      </Fragment>
    )
  }

  componentDidMount() {
    this.subscription = this.subscribePosts()
    this.subscriptionThread = this.subscribeThread()
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    if (this.subscriptionThread) {
      this.subscriptionThread.unsubscribe()
    }
  }

  subscribePosts() {
    const { match } = this.props
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .doc(match.params.threadId)
      .collection(POSTS)
      .limit(120)
      .orderBy('createdAt', DESC)
    return collectionData(query).subscribe(docs => {
      if (this.isUnmounted) return
      const posts = docs.map(doc => {
        return {
          ...doc,
          ui: { createdAt: createdAt(doc.createdAt) }
        }
      })
      this.setState({ posts, inProgressPosts: false })
    })
  }

  subscribeThread() {
    const { match } = this.props
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .doc(match.params.threadId)
    return docData(query)
      .pipe(take(2))
      .subscribe(doc => {
        if (this.isUnmounted) return
        const thread = { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
        this.setState({ thread, inProgressThread: false })
      })
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: {},
    progress: {
      display: 'block',
      marginTop: spacing.unit * 10,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    posts: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      marginTop: spacing.unit * 2,
      marginLeft: spacing.unit * 2,
      marginRight: spacing.unit * 2
    }
  })

export const PageThread = withStyles(styles)(Component)
