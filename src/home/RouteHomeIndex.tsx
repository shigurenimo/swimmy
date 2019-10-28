import { Theme, useMediaQuery } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Route, Switch, useParams } from 'react-router-dom'
import AppBarDefault from '../components/AppBarDefault'
import FragmentHead from '../components/FragmentHead'
import DrawerThread from './components/DrawerThread'
import MainHome from './components/MainHome'
import MainThread from './components/MainThread'

const RouteHomeIndex: FunctionComponent = () => {
  const { threadId } = useParams<{ threadId: string }>()

  const classes = useStyles({})

  const theme = useTheme<Theme>()

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <div className={classes.root}>
      <FragmentHead />
      {isDesktop && <DrawerThread threadId={threadId} />}
      <div>
        <AppBarDefault />
        <Switch>
          <Route component={MainHome} exact path={'/'} />
          <Route component={MainThread} exact path={'/threads/:threadId'} />
        </Switch>
      </div>
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ breakpoints, spacing }) => {
  return {
    root: {
      display: 'grid',
      [breakpoints.up('md')]: { gridTemplateColumns: `${spacing(50)}px 1fr` },
      [breakpoints.up('lg')]: { gridTemplateColumns: `${spacing(70)}px 1fr` }
    }
  }
})

export default RouteHomeIndex
