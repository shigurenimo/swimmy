import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { pct } from '../libs/styles/pct'

const AppLoading: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <CircularProgress size={50} />
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: pct(100),
    justifyContent: 'center',
    left: 0,
    position: 'fixed',
    top: 0,
    width: pct(100),
    zIndex: -1
  }
})

export default AppLoading
