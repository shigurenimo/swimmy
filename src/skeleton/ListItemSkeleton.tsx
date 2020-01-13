import { ListItem } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { FunctionComponent } from 'react'

const ListItemSkeleton: FunctionComponent = () => {
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

export default ListItemSkeleton
