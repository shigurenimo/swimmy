import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import ButtonLike from 'app/shared/components/ButtonLike'
import { Post } from 'app/shared/firestore/types/post'
import { resetList } from 'app/shared/styles/resetList'
import React, { FunctionComponent } from 'react'

type Props = { post: Post }

const DivPostTags: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles({})

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
    root: {
      ...resetList(),
      display: 'flex',
      flexWrap: 'wrap'
    },
    li: {
      marginRight: spacing(1)
    }
  }
})

export default DivPostTags
