import { Skeleton, Stack } from '@mui/material'
import React, { FunctionComponent } from 'react'

export const DivSkeleton: FunctionComponent = () => {
  return (
    <Stack px={2}>
      <Skeleton variant={'text'} height={19} width={'20%'} />
      <Skeleton variant={'text'} height={22} />
    </Stack>
  )
}
