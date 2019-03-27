import { ExpansionPanel, ExpansionPanelSummary } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { auth, firestore } from 'firebase/app'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { LIKES, POSTS } from '../constants/collection'
import { createPostLike } from '../helpers/createPostLike'
import { px } from '../libs/px'
import { Post } from '../types/models/post'
import ExpansionPanelSummaryPost from './ExpansionPanelSummaryPost'
import PostActions from './PostActions'

type Props = {
  inProgress?: boolean
  post: Post
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
    </ExpansionPanel>
  )
}

const useStyle = makeStyles(({ spacing }) => {
  return {
    content: { cursor: 'default', userSelect: 'text' },
    summary: { padding: `0 ${px(spacing(1.5))}` },
    textField: { marginTop: spacing(1) }
  }
})

export default ExpansionPanelPost
