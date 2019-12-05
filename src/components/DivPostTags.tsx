import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Post } from '../firestore/types/post'
import ButtonLike from './ButtonLike'

type Props = { post: Post }

const DivPostTags: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles()

  return (
    <ul className={classes.root}>
      <li className={classes.li}>
        <ButtonLike post={post} />
      </li>
    </ul>
  )
}

const useStyles = makeStyles<Theme>(({ palette, spacing }) => {
  return {
    li: { marginRight: spacing(1) },
    root: { display: 'flex', flexWrap: 'wrap' },
  }
})

export default DivPostTags
