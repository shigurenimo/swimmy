import { Divider, List, ListItem, ListItemText } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

const ListImages: FunctionComponent = () => {
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
      <ListItem disabled>
        <ListItemText primary={'フォト'} />
      </ListItem>
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

export default ListImages
