import { Paper, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

type Props = { fileIds: string[] }

export const DivImages: FunctionComponent<Props> = ({ fileIds }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {fileIds.map((fileId) => (
        <Paper key={fileId}>
          <img
            className={classes.img}
            src={`//swimmy.io/images/${fileId}?fm=png&w=400&h=400`}
            alt={fileId}
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
      [breakpoints.up('xs')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
      [breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(4, 1fr)' },
    },
  }
})
