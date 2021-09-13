import { Stack, Typography } from '@mui/material'
import React, { FunctionComponent } from 'react'

export const MainThreadNotFound: FunctionComponent = () => {
  return (
    <Stack justifyContent={'center'} pb={10} pt={10}>
      <Typography>{'このスレッドは存在しません。'}</Typography>
    </Stack>
  )
}
