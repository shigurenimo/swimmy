import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { makeStyles } from '@material-ui/styles'
import { auth, firestore } from 'firebase/app'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import ExpansionPanelSummaryPost from './ExpansionPanelSummaryPost'
import PostActions from './PostActions'
import TextFieldReplyPost from './TextFieldReplyPost'
import { LIKES, POSTS } from '../constants/collection'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { createPostLike } from '../libs/createPostLike'
import { px } from '../libs/styles/px'
import ListReplyPost from '../containers/ListReplyPost'

const useStyle = makeStyles(({ spacing }) => {
  return {
    summary: { padding: `0 ${px(spacing.unit * 1.5)}` },
    content: { cursor: 'default', userSelect: 'text' },
    textField: { marginTop: spacing.unit }
  }
})

interface Props {
  post: PostUi
  inProgress?: boolean
}

interface State {
  expanded: boolean
  hasLike: boolean
  inProgressLike: boolean
}

const ExpansionPanelPost: FunctionComponent<Props> = ({ inProgress, post }) => {
  const [state, setState] = useState<State>({
    expanded: false,
    hasLike: false,
    inProgressLike: true
  })

  const classes = useStyle({})

  const onChangeExpand = (_: any, expanded: boolean) => {
    if (!expanded) return
    if (!state.inProgressLike) return
    const { currentUser } = auth()
    if (!currentUser) return
    firestore()
      .collection(LIKES)
      .where('collectionId', '==', POSTS)
      .where('ownerId', '==', currentUser.uid)
      .where('docId', '==', post.id)
      .get()
      .then(res => {
        setState({ ...state, inProgressLike: false, hasLike: !res.empty })
      })
  }

  const onClickPanelSummary = (event: ChangeEvent<any>) => {
    if (event.target.tagName !== 'SPAN') {
      setState({ ...state, expanded: !state.expanded })
    }
  }

  const onClickLike = () => {
    if (inProgress) return
    const postId = post.id
    setState({ ...state, hasLike: !state.hasLike })
    createPostLike({ postId }).catch(err => {
      console.error(err)
    })
  }

  return (
    <ExpansionPanel expanded={state.expanded} onChange={onChangeExpand}>
      <ExpansionPanelSummary
        className={classes.summary}
        classes={{ content: classes.content }}
        onClick={onClickPanelSummary}
      >
        <ExpansionPanelSummaryPost post={post} />
      </ExpansionPanelSummary>
      <PostActions
        onClickLike={onClickLike}
        postId={post.id}
        inProgressLike={state.inProgressLike}
        hasLike={state.hasLike}
      />
      {state.expanded && (
        <ListReplyPost postId={post.id} replyPostCount={post.replyPostCount} />
      )}
      <div className={classes.textField}>
        <TextFieldReplyPost postId={post.id} />
      </div>
    </ExpansionPanel>
  )
}

export default ExpansionPanelPost
