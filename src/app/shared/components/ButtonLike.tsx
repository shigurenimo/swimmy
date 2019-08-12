import { Button, ButtonGroup, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { docData } from 'rxfire/firestore'
import { useAuthUser } from '../auth/useAuthUser'
import { LIKES, POSTS } from '../firestore/constants/collection'
import { deleteLike } from '../firestore/deleteLike'
import { Post } from '../firestore/types/post'
import { createLike } from '../functions/createLike'
import { mapNullable } from '../operators/mapNullable'

type Props = { post: Post }

const ButtonLike: FunctionComponent<Props> = ({ post }) => {
  const [authUser] = useAuthUser()

  const classes = useStyles({})

  const [loading, setLoading] = useState(true)

  const [active, setActive] = useState(false)

  useEffect(() => {
    if (authUser === null) return
    const subscription = docData(
      firestore()
        .collection(POSTS)
        .doc(post.id)
        .collection(LIKES)
        .doc(authUser.uid)
    )
      .pipe(mapNullable())
      .subscribe(like => {
        setActive(like !== null)
        setLoading(false)
      })
    return () => subscription.unsubscribe()
  }, [authUser, post.id])

  const onSubmit = () => {
    if (authUser === null) return
    if (active) {
      deleteLike({
        collectionId: POSTS,
        docId: post.id,
        userId: authUser.uid
      }).subscribe()
    } else {
      createLike()({ collectionId: POSTS, docId: post.id }).subscribe()
    }
  }

  return (
    <ButtonGroup
      color={'primary'}
      disabled={loading}
      onClick={onSubmit}
      variant={'outlined'}
    >
      <Button
        className={classNames(classes.button, { [classes.active]: active })}
      >
        {'スキ'}
      </Button>
      <Button className={classes.count}>{post.likeCount}</Button>
    </ButtonGroup>
  )
}

const useStyles = makeStyles<Theme>(({ palette, spacing }) => {
  return {
    active: {
      background: palette.primary.main,
      '&:not(:hover)': { color: '#fff' }
    },
    button: {
      paddingBottom: spacing(0.1),
      paddingTop: spacing(0.1)
    },
    count: {
      minWidth: 0,
      paddingBottom: spacing(0.1),
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      paddingTop: spacing(0.1)
    }
  }
})

export default ButtonLike
