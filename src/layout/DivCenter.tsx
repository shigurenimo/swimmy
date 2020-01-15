import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

const DivCenter: FunctionComponent = ({ children }) => {
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    root: {
      alignItems: 'center',
      display: 'grid',
      gridAutoColumns: 'max-content',
      justifyContent: 'center',
    },
  }
})

export default DivCenter
