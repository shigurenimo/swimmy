import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Theme,
  Toolbar,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { FragmentHead } from '../app/FragmentHead'
import { useAnalytics } from '../app/useAnalytics'

export const MainOthers: FunctionComponent = () => {
  useAnalytics()

  const classes = useStyles()

  return (
    <main className={classes.main}>
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
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    main: { display: 'grid', gridGap: spacing(1) },
  }
})
