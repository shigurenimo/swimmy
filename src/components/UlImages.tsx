import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { px } from '../libs/styles/px'
import { resetList } from '../libs/styles/resetList'
import CardImage from './CardImage'

interface Props {
  posts: PostUi[]
}

const UlImages: FunctionComponent<Props> = ({ posts }) => {
  const classes = useStyles({})

  return (
    <ul className={classes.posts}>
      {posts.map(post => (
        <li key={post.id}>
          <CardImage post={post} />
        </li>
      ))}
    </ul>
  )
}

const useStyles = makeStyles(({ breakpoints, spacing }) => {
  return {
    posts: {
      ...resetList(),
      display: 'grid',
      margin: 0,
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2,
      alignItems: 'center',
      gridColumnGap: px(spacing.unit * 2),
      gridRowGap: px(spacing.unit * 2),
      [breakpoints.up('xs')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
      [breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(3, 1fr)' },
      [breakpoints.up('md')]: { gridTemplateColumns: 'repeat(5, 1fr)' },
      [breakpoints.up('lg')]: { gridTemplateColumns: 'repeat(7, 1fr)' }
    }
  }
})

export default UlImages
