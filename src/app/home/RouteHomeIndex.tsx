import { Theme, useMediaQuery } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import DrawerThread from 'app/home/components/DrawerThread'
import MainHome from 'app/home/components/MainHome'
import MainThread from 'app/home/components/MainThread'
import AppBarDefault from 'app/shared/components/AppBarDefault'
import FragmentHead from 'app/shared/components/FragmentHead'
import React, { FunctionComponent } from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router'

type Props = RouteComponentProps<{ threadId: string }>

const RouteHomeIndex: FunctionComponent<Props> = ({
  location,
  match: {
    params: { threadId }
  }
}) => {
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
