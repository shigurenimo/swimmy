import { Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { WithStyles } from '@material-ui/styles/withStyles'
import { firestore } from 'firebase/app'
import React, { Component, Fragment } from 'react'
import { RouteComponentProps } from 'react-router'
import { collectionData, docData } from 'rxfire/firestore'
import { Subscription } from 'rxjs'
import { take } from 'rxjs/operators'
import PageTitle from '../components/PageTitle'
import { POSTS, POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import ListItemPost from '../containers/ListItemPost'
import TextFieldPost from '../containers/TextFieldPost'
import { Post } from '../interfaces/models/post/post'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

const styles = ({ spacing }: Theme) => {
  return createStyles({
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
}

interface Props extends WithStyles<typeof styles>, RouteComponentProps {}

interface State {
  posts: PostUi[]
  thread: PostUi | null
  inProgressPosts: boolean
  inProgressThread: boolean
}

class PageThread extends Component<Props> {
  public state: State = {
    posts: [],
    thread: null,
    inProgressPosts: true,
    inProgressThread: true
  }

  private isUnmounted = false
  private subscription?: Subscription
  private subscriptionThread?: Subscription

  render() {
    const { classes, match } = this.props
    const { posts, thread, inProgressPosts, inProgressThread } = this.state
    const inProgress = inProgressPosts || inProgressThread

    if (inProgress) {
      return <CircularProgress className={classes.progress} />
    }

    return (
      <main>
        <PageTitle
          title={'スレッド'}
          description={`書き込みとそれに対するレスが表示されています。このページの右上のアイコンから前のページに戻ることができます。`}
        />
        <TextFieldPost replyPostId={(match.params as any).threadId} />
        <Fade in>
          <div>
            {posts.map(post => (
              <Fragment key={post.id}>
                <ListItemPost post={post} />
                <Divider />
              </Fragment>
            ))}
            {thread && <ListItemPost post={thread} />}
          </div>
        </Fade>
      </main>
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
      .doc((match.params as any).threadId)
      .collection(POSTS)
      .limit(120)
      .orderBy('createdAt', DESC)
    return collectionData<Post>(query).subscribe(docs => {
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
      .doc((match.params as any).threadId)
    return docData<Post>(query)
      .pipe(take(2))
      .subscribe(doc => {
        if (this.isUnmounted) return
        const thread = { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
        this.setState({ thread, inProgressThread: false })
      })
  }
}

export default withStyles(styles)(PageThread)
