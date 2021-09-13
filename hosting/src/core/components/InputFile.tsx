import { Box } from '@mui/material'
import React, { ChangeEvent, FunctionComponent, RefObject } from 'react'

type Props = {
  inputRef: RefObject<HTMLInputElement>
  onChange(event: ChangeEvent<HTMLInputElement>): void
}

export const InputFile: FunctionComponent<Props> = ({ inputRef, onChange }) => {
  return (
    <Box
      component={'input'}
      accept={'image/*'}
      onChange={onChange}
      ref={inputRef}
      type={'file'}
      sx={{ display: 'none' }}
    />
  )
}
