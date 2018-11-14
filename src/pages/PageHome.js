import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { firestore } from 'firebase/app'
import React, { Fragment } from 'react'
import { collectionData } from 'rxfire/firestore'
import { Posts } from '../components/Posts'
import { POSTS, POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import { DialogPostDetail } from '../containers/DialogPostDetail'
import { TextFieldPost } from '../containers/TextFieldPost'
import { createdAt } from '../libs/createdAt'

class Component extends React.Component<any, any> {
  isUnmounted = false
  subscription = null
  subscriptionReply = null

  state = {
    posts: [],
    replyPosts: [],
    inProgress: true,
    inProgressReply: false,
    selectedPost: null
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

    this.setState({ selectedPost, replyPosts: [], inProgressReply: true })
    this.subscriptionReply = this.subscribeReplies(selectedPost)
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
        <TextFieldPost />
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <Posts posts={posts} selectPost={this.selectPost} />
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
    this.subscription = this.subscribePosts()
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    if (this.subscriptionReply) {
      this.subscriptionReply.unsubscribe()
    }
  }

  subscribePosts() {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .limit(40)
      .orderBy('createdAt', DESC)
    return collectionData(query).subscribe(docs => {
      if (this.isUnmounted) return
      const posts = docs.map(doc => {
        return {
          ...doc,
          ui: { createdAt: createdAt(doc.createdAt) }
        }
      })
      this.setState(state => {
        if (state.selectedPost) {
          return {
            posts,
            inProgress: false,
            selectedPost: posts.find(post => post.id === state.selectedPost.id)
          }
        } else {
          return { posts, inProgress: false }
        }
      })
    })
  }

  subscribeReplies(selectedPost: any) {
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
    }
  })

export const PageHome = withStyles(styles)(Component)
