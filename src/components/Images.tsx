import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'

type Props = {
  photoURLs: string[]
}

const Images: FunctionComponent<Props> = ({ photoURLs }) => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      {photoURLs.map(photoURL => (
        <Paper key={photoURL}>
          <img
            className={classes.img}
            src={photoURL + '=s400'}
            alt={photoURL}
          />
        </Paper>
      ))}
    </div>
  )
}

const useStyles = makeStyles(({ breakpoints, spacing }) => {
  return {
    img: { width: pct(100), borderRadius: px(4), verticalAlign: 'bottom' },
    root: {
      display: 'grid',
      gridColumnGap: px(spacing.unit * 2),
      gridRowGap: px(spacing.unit * 2),
      width: '100%',
      [breakpoints.up('xs')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
      [breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(4, 1fr)' }
    }
  }
})

export default Images
