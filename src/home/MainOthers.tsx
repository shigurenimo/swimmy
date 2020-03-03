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
import FragmentHead from '../web/FragmentHead'
import { useAnalytics } from '../web/useAnalytics'

const MainOthers: FunctionComponent = () => {
  useAnalytics()

  const classes = useStyles()

  return (
    <main className={classes.main}>
      <FragmentHead title={null} />
      <Toolbar />
      <List disablePadding>
        <ListItem disabled>
          <ListItemText primary={'スレッド β'} />
        </ListItem>
        <Divider />
        <ListItem disabled>
          <ListItemText primary={'統計データ'} />
        </ListItem>
        <Divider />
        <Link to={'/privacy'}>
          <ListItem button>
            <ListItemText primary={'プライバシー・ポリシー'} />
          </ListItem>
        </Link>
        <Divider />
        <a
          href={'https://twitter.com/babelrc'}
          target={'_blank'}
          rel="noopener noreferrer"
        >
          <ListItem button>
            <ListItemText primary={'Twitter @babelrc'} />
          </ListItem>
        </a>
        <Divider />
        <a
          href={'https://github.com/swimmy/swimmy'}
          target={'_blank'}
          rel="noopener noreferrer"
        >
          <ListItem button>
            <ListItemText primary={'GitHub swiwmmy/swimmy'} />
          </ListItem>
        </a>
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

export default MainOthers
