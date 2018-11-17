import createStyles from '@material-ui/core/es/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'

const Component = ({ classes, photoURLs }) => {
  return (
    <div className={classes.root}>
      {photoURLs.map(photoURL => (
        <img
          key={photoURL}
          className={classes.img}
          src={photoURL + '=s400'}
          alt={photoURL}
        />
      ))}
    </div>
  )
}

const styles = ({ breakpoints, spacing }) =>
  createStyles({
    root: {
      width: '100%',
      display: 'grid',
      gridColumnGap: px(spacing.unit * 2),
      gridRowGap: px(spacing.unit * 2),
      [breakpoints.up('xs')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
      [breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(4, 1fr)' }
    },
    img: { width: pct(100), borderRadius: px(4) }
  })

export const Images = withStyles(styles)(Component)
