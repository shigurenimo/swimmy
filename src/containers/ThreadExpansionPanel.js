import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { auth, firestore } from 'firebase/app'
import React from 'react'
import { PostExpansionPanelSummary } from '../components/PostExpansionPanelSummary'
import { ThreadActions } from '../components/ThreadActions'
import { LIKES, POSTS } from '../constants/collection'
import { createPostLike } from '../libs/createPostLike'

class Component extends React.Component<any, any> {
  isUnmounted = false

  state = {
    expanded: false,
    hasLike: false,
    inProgressLike: true
  }

  render() {
    const { classes, post, onSelectPost } = this.props
    const { expanded, inProgressLike, hasLike } = this.state

    return (
      <ExpansionPanel expanded={expanded} onChange={this.onChangeExpand}>
        <ExpansionPanelSummary
          className={classes.summary}
          onClick={this.onClickPanelSummary}
        >
          <PostExpansionPanelSummary post={post} />
        </ExpansionPanelSummary>
        <ThreadActions
          onSelectPost={onSelectPost}
          onClickLike={this.onClickLike}
          postId={post.id}
          inProgressLike={inProgressLike}
          hasLike={hasLike}
        />
      </ExpansionPanel>
    )
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.isUnmounted = true
  }

  onClickLike = () => {
    const { post } = this.props

    this.clickLike(post.id)
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
  }
})

export const ThreadExpansionPanel = withStyles(styles)(Component)
