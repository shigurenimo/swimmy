import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { CardImage } from '../containers/CardImage'
import { px } from '../libs/styles/px'
import { resetList } from '../libs/styles/resetList'

const Component = ({ classes, posts }) => {
  return (
    <ul className={classes.posts}>
      {posts.map(post => (
        <li key={post.id} className={classes.card}>
          <CardImage post={post} />
        </li>
      ))}
    </ul>
  )
}

const styles = ({ breakpoints, spacing }) =>
  createStyles({
    posts: {
      ...resetList(),
      display: 'grid',
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2,
      paddingTop: spacing.unit * 2,
      alignItems: 'center',
      gridColumnGap: px(spacing.unit * 2),
      gridRowGap: px(spacing.unit * 2),
      [breakpoints.up('xs')]: { gridTemplateColumns: '1fr' },
      [breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(3, 1fr)' },
      [breakpoints.up('md')]: { gridTemplateColumns: 'repeat(5, 1fr)' },
      [breakpoints.up('lg')]: { gridTemplateColumns: 'repeat(7, 1fr)' }
    }
  })

export const CardImages = withStyles(styles)(Component)
