import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

const MainThreadNotFound: FunctionComponent = () => {
  const classes = useStyles()

  return (
    <main className={classes.root}>
      <Typography>{'このスレッドは存在しません。'}</Typography>
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ palette, spacing, typography }) => {
  return {
    root: {
      display: 'grid',
      justifyContent: 'center',
      paddingBottom: spacing(10),
      paddingTop: spacing(10),
    },
  }
})

export default MainThreadNotFound
