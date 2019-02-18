import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { makeStyles } from '@material-ui/styles'
import { auth, firestore } from 'firebase/app'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { LIKES, POSTS } from '../constants/collection'
import { createPostLike } from '../helpers/createPostLike'
import { PostUi } from '../interfaces/models/postUi'
import { px } from '../libs/styles/px'
import ExpansionPanelSummaryPost from './ExpansionPanelSummaryPost'
import ListReplyPost from './ListReplyPost'
import PostActions from './PostActions'
import TextFieldReplyPost from './TextFieldReplyPost'

const useStyle = makeStyles(({ spacing }) => {
  return {
    content: { cursor: 'default', userSelect: 'text' },
    summary: { padding: `0 ${px(spacing.unit * 1.5)}` },
    textField: { marginTop: spacing.unit }
  }
})

interface Props {
  inProgress?: boolean
  post: PostUi
}

const ExpansionPanelPost: FunctionComponent<Props> = ({ inProgress, post }) => {
  const [expanded, setExpanded] = useState(false)
  const [hasLike, setHasLike] = useState(false)
  const [inProgressLike, setInProgressLike] = useState(true)
  const classes = useStyle({})
  const onChangeExpand = (_: any, _expanded: boolean) => {
    const { currentUser } = auth()
    if (!_expanded || !inProgressLike || !currentUser) {
      return
    }
    firestore()
      .collection(LIKES)
      .where('collectionId', '==', POSTS)
      .where('ownerId', '==', currentUser.uid)
      .where('docId', '==', post.id)
      .get()
      .then(res => {
        setInProgressLike(false)
        setHasLike(!res.empty)
      })
  }
  const onClickPanelSummary = (event: ChangeEvent<any>) => {
    if (event.target.tagName !== 'SPAN') {
      setExpanded(state => !state)
    }
  }
  const onClickLike = () => {
    if (inProgress) {
      return
    }
    const postId = post.id
    setHasLike(state => !state)
    createPostLike({ postId }).catch(err => {
      console.error(err)
    })
  }

  return (
    <ExpansionPanel expanded={expanded} onChange={onChangeExpand}>
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
        inProgressLike={inProgressLike}
        hasLike={hasLike}
      />
      {expanded && (
        <ListReplyPost postId={post.id} replyPostCount={post.replyPostCount} />
      )}
      <div className={classes.textField}>
        <TextFieldReplyPost postId={post.id} />
      </div>
    </ExpansionPanel>
  )
}

export default ExpansionPanelPost
