import { Divider, List, ListItem, ListItemText } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

export const ListOthers: FunctionComponent = () => {
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
      <ListItem disabled>
        <ListItemText primary={'その他'} />
      </ListItem>
      <Divider />
      <ListItem disabled>
        <ListItemText primary={'バージョン 7.0.0'} />
      </ListItem>
      <Divider />
    </List>
  )
}
