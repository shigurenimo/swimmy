import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

type Props = {
  inputRef: any
  onChange: any
}

const InputFile: FunctionComponent<Props> = ({ inputRef, onChange }) => {
  const classes = useStyles({})

  return (
    <input
      accept={'image/*'}
      className={classes.root}
      onChange={onChange}
      ref={inputRef}
      type={'file'}
    />
  )
}

const useStyles = makeStyles({ root: { display: 'none' } })

export default InputFile
