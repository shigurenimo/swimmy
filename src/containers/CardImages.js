import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { ImageCard } from '../containers/ImageCard'
import { px } from '../libs/styles/px'
import { resetList } from '../libs/styles/resetList'

class Component extends React.Component<any, any> {
  render() {
    const { classes, posts } = this.props

    return (
      <ul className={classes.posts}>
        {posts.map(post => (
          <li key={post.id} className={classes.card}>
            <ImageCard post={post} />
          </li>
        ))}
      </ul>
    )
  }
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
