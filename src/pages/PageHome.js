import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import withStyles from '@material-ui/core/styles/withStyles'
import { firestore } from 'firebase/app'
import React, { Component, Fragment } from 'react'
import PostTextField from '../containers/PostTextField'
import { POSTS, POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import PostDetailDialog from '../containers/PostDetailDialog'
import PostExpansionPanel from '../containers/PostExpansionPanel'
import { createdAt } from '../libs/createdAt'

class PageHome extends Component<any, any> {
  isUnmounted = false
  unsubscribe = null
  unsubscribeReply = null

  state = {
    posts: [],
    replyPosts: [],
    inProgress: true,
    inProgressReply: false,
    selectedPost: null
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
        <PostTextField />
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <div className={classes.posts}>
              {posts.map(post => (
                <PostExpansionPanel
                  key={post.id}
                  post={post}
                  selectPost={this.selectPost}
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

  onCloseReplyDialog = () => {
    if (this.unsubscribeReply) {
      this.unsubscribeReply()
      this.unsubscribeReply = null
    }
    this.setState({ selectedPost: null })
  }

  selectPost = (postId: string) => {
    const { posts } = this.state
    const selectedPost = posts.find(post => post.id === postId)

    this.setState(state => {
      return { selectedPost, replyPosts: [], inProgressReply: true }
    })
    this.subscribeReplyPosts(selectedPost)
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
              createdAt: createdAt(data.createdAt.seconds)
            }
          }
        })
        if (this.isUnmounted) return
        this.setState({ replyPosts, inProgressReply: false })
      })
  }

  subscribePosts() {
    this.unsubscribe = firestore()
      .collection(POSTS_AS_ANONYM)
      .limit(40)
      .orderBy('createdAt', DESC)
      .onSnapshot(querySnapshot => {
        const posts = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            ...data,
            ui: {
              createdAt: createdAt(data.createdAt.seconds)
            }
          }
        })
        if (this.isUnmounted) return
        this.setState(state => {
          if (state.selectedPost) {
            return {
              posts,
              inProgress: false,
              selectedPost: posts.find(
                post => post.id === state.selectedPost.id
              )
            }
          } else {
            return { posts, inProgress: false }
          }
        })
      })
  }

  componentDidMount() {
    this.subscribePosts()
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    if (this.unsubscribeReply) {
      this.unsubscribeReply()
    }
  }
}

const styles = () => ({
  root: {},
  posts: {},
  progress: {
    display: 'block',
    marginTop: 80,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

export default withStyles(styles)(PageHome)
