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

const useStyles = makeStyles<Theme>((theme) => {
  return {
    img: { width: `${100}%`, borderRadius: 4, verticalAlign: 'bottom' },
    root: {
      display: 'grid',
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      width: '100%',
    },
  }
})
