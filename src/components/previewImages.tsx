import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { pct } from '../libs/pct'
import { px } from '../libs/px'

type Props = {
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
    img: { width: pct(100), borderRadius: px(4) },
    root: {
      display: 'grid',
      gridColumnGap: px(spacing(2)),
      gridRowGap: px(spacing(2)),
      gridTemplateColumns: 'repeat(4, 1fr)',
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      width: '100%'
    }
  }
})

export default PreviewImages
