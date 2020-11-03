import { Paper, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

type Props = { fileIds: string[] }

export const DivThreadImages: FunctionComponent<Props> = ({ fileIds }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {fileIds.map((fileId) => (
        <Paper key={fileId}>
          <img
            alt={fileId}
            className={classes.img}
            src={`//swimmy.io/images/${fileId}?fm=png&w=800`}
          />
        </Paper>
      ))}
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
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
