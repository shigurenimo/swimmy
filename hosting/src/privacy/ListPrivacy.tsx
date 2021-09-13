import { Divider, List, ListItem, ListItemText } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

export const ListPrivacy: FunctionComponent = () => {
  return (
    <List disablePadding>
      <Link to={'/'}>
        <ListItem button>
          <ListItemText primary={'ホーム'} />
        </ListItem>
      </Link>
      <Divider />
      <Link to={'/threads'}>
        <ListItem button>
          <ListItemText primary={'スレッド'} />
        </ListItem>
      </Link>
      <Divider />
      <Link to={'/photos'}>
        <ListItem button>
          <ListItemText primary={'フォト'} />
        </ListItem>
      </Link>
      <Divider />
      <Link to={'/others'}>
        <ListItem button>
          <ListItemText primary={'その他'} />
        </ListItem>
      </Link>
      <Divider />
    </List>
  )
}
