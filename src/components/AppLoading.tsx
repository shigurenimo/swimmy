import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/styles'
import React, { SFC } from 'react'
import { pct } from '../libs/styles/pct'

const AppLoading: SFC = () => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <CircularProgress size={50} />
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: pct(100),
    height: pct(100),
    zIndex: -1
  }
})

export default AppLoading
