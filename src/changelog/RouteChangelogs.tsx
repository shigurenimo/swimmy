import { CircularProgress, Divider, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import AppBarDefault from '../components/AppBarDefault'
import FragmentHead from '../components/FragmentHead'
import ToolbarDefault from '../components/ToolbarDefault'
import CardChangelog from './components/CardChangelog'
import { usePrismicChangelogs } from './hooks/usePrismicChangelogs'

const RouteChangelogs: FunctionComponent = () => {
  const classes = useStyles()

  const [changelogs, loading] = usePrismicChangelogs()

  return (
    <Fragment>
      <FragmentHead
        title={'アップデート履歴'}
        description={'スイミーの過去のアップデート履歴です。'}
      />
      <AppBarDefault />
      <ToolbarDefault />
      {loading && <CircularProgress className={classes.progress} />}
      <main className={classes.root}>
        <ul className={classes.changelogs}>
          {changelogs.map(changelog => (
            <li key={changelog.version}>
              <Divider />
              <CardChangelog changelog={changelog} />
            </li>
          ))}
        </ul>
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    changelogs: { display: 'grid' },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10),
    },
    root: { display: 'grid', gridRowGap: spacing(2) },
  }
})

export default RouteChangelogs
