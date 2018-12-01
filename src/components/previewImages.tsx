import makeStyles from '@material-ui/styles/makeStyles'
import React, { FunctionComponent } from 'react'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'

interface Props {
  photoURLs: string[]
}

const PreviewImages: FunctionComponent<Props> = ({ photoURLs }) => {
  const classes = useStyles({})

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

const useStyles = makeStyles(({ breakpoints, spacing }) => {
  return {
    root: {
      width: '100%',
      display: 'grid',
      gridColumnGap: px(spacing.unit * 2),
      gridRowGap: px(spacing.unit * 2),
      gridTemplateColumns: 'repeat(4, 1fr)',
      paddingLeft: spacing.unit,
      paddingRight: spacing.unit
    },
    img: { width: pct(100), borderRadius: px(4) }
  }
})

export default PreviewImages
