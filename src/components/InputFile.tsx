import { makeStyles } from '@material-ui/styles'
import React, { SFC } from 'react'

interface Props {
  inputRef: any
  onChange: any
}

const InputFile: SFC<Props> = ({ inputRef, onChange }) => {
  const classes = useStyles({})

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

const useStyles = makeStyles({
  root: { display: 'none' }
})

export default InputFile
