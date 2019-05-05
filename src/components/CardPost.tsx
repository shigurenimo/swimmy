import { Card, Typography, Theme } from '@material-ui/core'
import { purple } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/styles'
import { auth, firestore } from 'firebase/app'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import { LIKES, POSTS } from '../constants/collection'
import { createPostLike } from '../helpers/createPostLike'
import { toDateText } from '../helpers/toDateText'
import { px } from '../libs/px'
import { Post } from '../types/models/post'
import Images from './Images'
import PostCounts from './PostCounts'

type Props = {
  inProgress?: boolean
  post: Post
}

const CardPost: FunctionComponent<Props> = ({ inProgress, post }) => {
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
    createPostLike({ postId }).subscribe()
  }

  return (
    <Link to={`/threads/${post.id}`}>
      <Card className={classes.card} elevation={0}>
        <PostCounts
          replyPostCount={post.replyPostCount}
          likeCount={post.likeCount}
        />
        <Typography className={classes.text} variant={'body2'}>
          {post.text}
        </Typography>
        {post.photoURLs.length !== 0 && <Images photoURLs={post.photoURLs} />}
        <Typography color={'textSecondary'} variant={'caption'}>
          {toDateText(post.createdAt)}
        </Typography>
      </Card>
    </Link>
  )
}

const useStyle = makeStyles<Theme>(({ palette, spacing, typography }) => {
  return {
    card: {
      padding: spacing(2),
      ['&:hover']: { background: 'rgba(0, 0, 0, 0.1)' }
    },
    likeCount: { paddingLeft: spacing(1), color: palette.secondary.light },
    replyPostCount: { color: purple.A400, paddingLeft: spacing(1) },
    root: {
      display: 'grid',
      gridRowGap: px(8),
      paddingRight: '0 !important'
    },
    text: {
      fontSize: typography.pxToRem(16),
      fontWeight: typography.fontWeightMedium,
      whiteSpace: 'pre-line',
      wordBreak: 'break-all'
    }
  }
})

export default CardPost
