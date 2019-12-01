import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { ChangeEvent, FunctionComponent, RefObject } from 'react'

type Props = {
  inputRef: RefObject<HTMLInputElement>
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const InputFile: FunctionComponent<Props> = ({ inputRef, onChange }) => {
  const classes = useStyles()

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

const useStyles = makeStyles<Theme>({ root: { display: 'none' } })

export default InputFile
