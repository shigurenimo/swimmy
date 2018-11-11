import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Tab from '@material-ui/core/Tab/Tab'
import Tabs from '@material-ui/core/Tabs/Tabs'
import { firestore } from 'firebase/app'
import React, { Fragment } from 'react'
import {
  POSTS,
  POSTS_AS_ANONYM,
  POSTS_AS_THREAD
} from '../constants/collection'
import { DESC } from '../constants/order'
import { PostDetailDialog } from '../containers/PostDetailDialog'
import { ThreadExpansionPanel } from '../containers/ThreadExpansionPanel'
import { createdAt } from '../libs/createdAt'

class Component extends React.Component<any, any> {
  isUnmounted = false

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
    this.updatePosts(orderBy)
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

    this.subscribeReplyPosts(selectedPost)
  }
  onCloseReplyDialog = () => {
    if (this.unsubscribeReply) {
      this.unsubscribeReply()
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
                <ThreadExpansionPanel
                  key={post.id}
                  post={post}
                  onSelectPost={this.onSelectPost(post.id)}
                />
              ))}
            </div>
          </Fade>
        )}
        <PostDetailDialog
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

    this.updatePosts(orderBy)
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }

  updatePosts(orderBy: string) {
    firestore()
      .collection(POSTS_AS_THREAD)
      .limit(100)
      .orderBy(orderBy, DESC)
      .get()
      .then(querySnapshot => {
        const posts = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            ...data,
            ui: {
              createdAt: createdAt(data.createdAt)
            }
          }
        })
        if (this.isUnmounted) return
        this.setState({ posts, inProgress: false })
      })
  }

  subscribeReplyPosts(selectedPost: any) {
    this.unsubscribeReply = firestore()
      .collection(POSTS_AS_ANONYM)
      .doc(selectedPost.id)
      .collection(POSTS)
      .limit(80)
      .orderBy('createdAt', DESC)
      .onSnapshot(querySnapshot => {
        const replyPosts = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            ...data,
            ui: {
              createdAt: createdAt(data.createdAt)
            }
          }
        })
        if (this.isUnmounted) return
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
    }
  })

export const PageThreads = withStyles(styles)(Component)
