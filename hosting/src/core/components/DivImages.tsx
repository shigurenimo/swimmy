import { Paper, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

type Props = { fileIds: string[] }

export const BoxImages: FunctionComponent<Props> = ({ fileIds }) => {
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

const useStyles = makeStyles<Theme>((theme) => {
  return {
    img: { width: `${100}%`, borderRadius: 4, verticalAlign: 'bottom' },
    root: {
      display: 'grid',
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      width: '100%',
      [theme.breakpoints.up('xs')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
      [theme.breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(4, 1fr)' },
    },
  }
})
