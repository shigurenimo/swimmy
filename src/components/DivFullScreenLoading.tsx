import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

const DivFullScreenLoading: FunctionComponent = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}

const useStyles = makeStyles(() => {
  return {
    root: {
      alignItems: 'center',
      display: 'grid',
      height: '100%',
      justifyContent: 'center',
      left: 0,
      position: 'fixed',
      top: 0,
      width: '100%',
    },
  }
})

export default DivFullScreenLoading
