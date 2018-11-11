import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { auth, firestore } from 'firebase/app'
import React from 'react'
import { PostActions } from '../components/PostActions'
import { ExpansionPanelSummaryPost } from '../components/ExpansionPanelSummaryPost'
import { LIKES, POSTS } from '../constants/collection'
import { createPostLike } from '../libs/createPostLike'
import { ListReplyPost } from './ListReplyPost'
import { TextFieldReplyPost } from './TextFieldReplyPost'

class Component extends React.Component<any, any> {
  isUnmounted = false
  state = { expanded: false, hasLike: false, inProgressLike: true }
  onClickLike = () => {
    const { post } = this.props

    this.clickLike(post.id)
  }
  onSelectPost = () => {
    const { post, selectPost } = this.props

    selectPost(post.id)
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

  render() {
    const { classes, post } = this.props
    const { expanded, inProgressLike, hasLike } = this.state

    return (
      <ExpansionPanel expanded={expanded} onChange={this.onChangeExpand}>
        <ExpansionPanelSummary
          className={classes.summary}
          onClick={this.onClickPanelSummary}
        >
          <ExpansionPanelSummaryPost post={post} />
        </ExpansionPanelSummary>
        <PostActions
          onSelectPost={this.onSelectPost}
          onClickLike={this.onClickLike}
          postId={post.id}
          inProgressLike={inProgressLike}
          hasLike={hasLike}
        />
        {expanded && (
          <ListReplyPost
            postId={post.id}
            replyPostCount={post.replyPostCount}
          />
        )}
        <div className={classes.textField}>
          <TextFieldReplyPost postId={post.id} />
        </div>
      </ExpansionPanel>
    )
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.isUnmounted = true
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: { width: '100%' },
    summary: { padding: '0 12px' },
    textField: { marginTop: spacing.unit }
  })

export const ExpansionPanelPost = withStyles(styles)(Component)
