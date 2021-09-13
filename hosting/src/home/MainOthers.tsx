import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Toolbar,
} from '@mui/material'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { FragmentHead } from 'src/core/components/FragmentHead'
import { useAnalytics } from 'src/core/hooks/useAnalytics'

export const MainOthers: FunctionComponent = () => {
  useAnalytics()

  return (
    <Stack spacing={1}>
      <FragmentHead title={null} />
      <Toolbar />
      <List disablePadding>
        <Link to={'/changelogs'}>
          <ListItem button>
            <ListItemText primary={'アップデート履歴'} />
          </ListItem>
        </Link>
        <Divider />
        <Link to={'/privacy'}>
          <ListItem button>
            <ListItemText primary={'プライバシー・ポリシー'} />
          </ListItem>
        </Link>
        <Divider />
      </List>
    </Stack>
  )
}
