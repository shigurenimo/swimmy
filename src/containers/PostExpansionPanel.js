import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { auth, firestore } from 'firebase/app'
import React, { Component } from 'react'
import PostActions from '../components/PostActions'
import PostExpansionPanelSummary from '../components/PostExpansionPanelSummary'
import { LIKES, POSTS } from '../constants/collection'
import { createPostLike } from '../libs/createPostLike'
import PostAsReplyList from './PostAsReplyList'
import PostAsReplyTextField from './PostAsReplyTextField'

class PostExpansionPanel extends Component<any, any> {
  isUnmounted = false

  state = {
    expanded: false,
    hasLike: false,
    inProgressLike: true
  }

  render() {
    const { classes, post } = this.props
    const { expanded, inProgressLike, hasLike } = this.state

    return (
      <ExpansionPanel expanded={expanded} onChange={this.onChangeExpand}>
        <ExpansionPanelSummary
          className={classes.summary}
          onClick={this.onClickPanelSummary}
        >
          <PostExpansionPanelSummary post={post} />
        </ExpansionPanelSummary>
        <PostActions
          onSelectPost={this.onSelectPost}
          onClickLike={this.onClickLike}
          postId={post.id}
          inProgressLike={inProgressLike}
          hasLike={hasLike}
        />
        {expanded && (
          <PostAsReplyList
            postId={post.id}
            replyPostCount={post.replyPostCount}
          />
        )}
        <div className={classes.textField}>
          <PostAsReplyTextField postId={post.id} />
        </div>
      </ExpansionPanel>
    )
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.isUnmounted = true
  }

  onClickLike = () => {
    const { postId } = this.props

    this.clickLike(postId)
  }

  onSelectPost = () => {
    const { postId, selectPost } = this.props

    selectPost(postId)
  }

  onChangeExpand = (_, expanded) => {
    if (this.isUnmounted) return

    const { post } = this.props

    if (!expanded) return

    const { inProgressLike } = this.state

    if (!inProgressLike) return

    const { currentUser } = auth()

    if (!currentUser) return

    firestore()
      .collection(LIKES)
      .where('collectionId', '==', POSTS)
      .where('ownerId', '==', currentUser.uid)
      .where('docId', '==', post.id)
      .get()
      .then(res => {
        if (this.isUnmounted) return
        this.setState({ inProgressLike: false, hasLike: !res.empty })
      })
  }

  onClickPanelSummary = event => {
    if (event.target.tagName !== 'SPAN') {
      this.setState(state => ({ expanded: !state.expanded }))
    }
  }

  clickLike = (postId: string) => {
    if (this.isUnmounted) return

    const { inProgress } = this.props

    if (inProgress) return

    this.setState(state => ({ hasLike: !state.hasLike }))

    createPostLike({ postId }).catch(err => {
      console.error(err)
    })
  }
}

const styles = createStyles({
  root: {
    width: '100%'
  },
  summary: {
    padding: '0 12px'
  },
  textField: {
    marginTop: 8
  }
})

export default withStyles(styles)(PostExpansionPanel)
