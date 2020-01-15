import { CircularProgress, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

const DivLoading: FunctionComponent = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    root: {
      alignItems: 'center',
      display: 'grid',
      height: spacing(50),
      justifyContent: 'center',
      width: '100%',
    },
  }
})

export default DivLoading
