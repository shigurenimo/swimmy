import { Paper, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

type Props = { photoURLs: string[] }

const DivThreadImages: FunctionComponent<Props> = ({ photoURLs }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {photoURLs.map(photoURL => (
        <Paper key={photoURL}>
          <img
            alt={photoURL}
            className={classes.img}
            src={`${photoURL}=s400`}
          />
        </Paper>
      ))}
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ breakpoints, spacing }) => {
  return {
    img: { width: `${100}%`, borderRadius: 4, verticalAlign: 'bottom' },
    root: {
      display: 'grid',
      gridColumnGap: `${spacing(2)}px`,
      gridRowGap: `${spacing(2)}px`,
      width: '100%',
    },
  }
})

export default DivThreadImages
