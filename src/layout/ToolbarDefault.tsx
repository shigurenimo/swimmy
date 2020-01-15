import { Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

const ToolbarDefault: FunctionComponent = () => {
  const classes = useStyles()

  return <Toolbar className={classes.root} />
}

const useStyles = makeStyles<Theme>(() => {
  return { root: { marginTop: 'env(safe-area-inset-top)' } }
})

export default ToolbarDefault
