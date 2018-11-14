import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Tab from '@material-ui/core/Tab/Tab'
import Tabs from '@material-ui/core/Tabs/Tabs'
import { firestore } from 'firebase/app'
import React, { Fragment } from 'react'
import { collectionData } from 'rxfire/firestore'
import {
  POSTS,
  POSTS_AS_ANONYM,
  POSTS_AS_THREAD
} from '../constants/collection'
import { DESC } from '../constants/order'
import { DialogPostDetail } from '../containers/DialogPostDetail'
import { CardThread } from '../containers/CardThread'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
  isUnmounted = false
  subscriptionReplies = null
  subscription = null

  state = {
    posts: [],
    replyPosts: [],
    inProgress: true,
    inProgressReply: false,
    selectedPost: null,
    orderBy: 'createdAt'
  }
  onChangeTab = (event, orderBy) => {
    this.setState({ orderBy, inProgress: true })
    this.subscribePosts(orderBy)
  }
  onSelectPost = (postId: string) => () => {
    this.selectPost(postId)
  }
  selectPost = (postId: string) => {
    const { posts } = this.state
    const selectedPost = posts.find(post => post.id === postId)

    this.setState(() => {
      return { selectedPost, replyPosts: [], inProgressReply: true }
    })

    if (this.subscriptionReplies) {
      this.subscriptionReplies.unsubscribe()
      this.unsubscribeReply = null
    }

    this.subscriptionReplies = this.subscribeReplyPosts(selectedPost)
  }
  onCloseReplyDialog = () => {
    if (this.subscriptionReplies) {
      this.subscriptionReplies.unsubscribe()
      this.unsubscribeReply = null
    }
    this.setState({ selectedPost: null })
  }

  render() {
    const { classes } = this.props
    const {
      posts,
      inProgress,
      inProgressReply,
      replyPosts,
      selectedPost
    } = this.state

    return (
      <Fragment>
        <Tabs
          value={this.state.orderBy}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.onChangeTab}
        >
          <Tab label="新着" value={'createdAt'} />
          <Tab label="更新" value={'updatedAt'} />
          <Tab label="書き込み数" value={'replyPostCount'} />
        </Tabs>
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <div className={classes.posts}>
              {posts.map(post => (
                <CardThread
                  key={post.id}
                  post={post}
                  onSelectPost={this.onSelectPost(post.id)}
                />
              ))}
            </div>
          </Fade>
        )}
        <DialogPostDetail
          posts={replyPosts}
          inProgress={inProgressReply}
          onClose={this.onCloseReplyDialog}
          isOpen={Boolean(selectedPost)}
        />
      </Fragment>
    )
  }

  componentDidMount() {
    const { orderBy } = this.state

    this.subscription = this.subscribePosts(orderBy)
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    if (this.subscriptionReplies) {
      this.subscriptionReplies.unsubscribe()
    }
  }

  subscribePosts(orderBy: string) {
    const query = firestore()
      .collection(POSTS_AS_THREAD)
      .limit(100)
      .orderBy(orderBy, DESC)
    return collectionData(query).subscribe(docs => {
      if (this.isUnmounted) return
      const posts = docs.map(doc => {
        return {
          ...doc,
          ui: { createdAt: createdAt(doc.createdAt) }
        }
      })
      this.setState({ posts, inProgress: false })
    })
  }

  subscribeReplyPosts(selectedPost: any) {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .doc(selectedPost.id)
      .collection(POSTS)
      .limit(120)
      .orderBy('createdAt', DESC)
    return collectionData(query).subscribe(docs => {
      if (this.isUnmounted) return
      const replyPosts = docs.map(doc => {
        return {
          ...doc,
          ui: { createdAt: createdAt(doc.createdAt) }
        }
      })
      this.setState({ replyPosts, inProgressReply: false })
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

export const PageThreads = withStyles(styles)(Component)
