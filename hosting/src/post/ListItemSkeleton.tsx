import { ListItem, Skeleton } from '@mui/material'
import React, { FunctionComponent } from 'react'

export const ListItemSkeleton: FunctionComponent = () => {
  return (
    <ListItem divider>
      <div style={{ width: '100%' }}>
        <Skeleton variant={'text'} height={22} />
        <Skeleton variant={'text'} height={22} />
        <Skeleton variant={'text'} height={19} width={80} />
      </div>
    </ListItem>
  )
}
