import createStyles from '@material-ui/core/es/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'

const Component = ({ classes, inputRef, onChange }) => {
  return (
    <input
      className={classes.root}
      type={'file'}
      ref={inputRef}
      accept="image/*"
      onChange={onChange}
    />
  )
}

const styles = createStyles({
  root: { display: 'none' }
})

export const InputFile = withStyles(styles)(Component)
