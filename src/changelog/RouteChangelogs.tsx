import { CircularProgress, Fade, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import Header from '../components/AppBarDefault'
import FragmentHead from '../components/FragmentHead'
import { px } from '../styles/px'
import { resetList } from '../styles/resetList'
import CardChangelog from './components/CardChangelog'
import { usePrismicChangelogs } from './hooks/usePrismicChangelogs'

const RouteChangelogs: FunctionComponent = () => {
  const classes = useStyles({})
  const [[changelogs, inProgress]] = usePrismicChangelogs()

  return (
    <Fragment>
      <FragmentHead
        title={'アップデート履歴'}
        description={'スイミーの過去のアップデート履歴です。'}
      />
      <Header />
      {inProgress && <CircularProgress className={classes.progress} />}
      {!inProgress && (
        <Fade in>
          <main className={classes.root}>
            <ul className={classes.changelogs}>
              {changelogs.map(changelog => (
                <li key={changelog.version}>
                  <CardChangelog changelog={changelog} />
                </li>
              ))}
            </ul>
          </main>
        </Fade>
      )}
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    changelogs: {
      ...resetList(),
      display: 'grid',
      gridRowGap: px(spacing(2)),
      paddingLeft: spacing(2),
      paddingRight: spacing(2)
    },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10)
    },
    root: {
      display: 'grid',
      gridRowGap: px(spacing(2))
    }
  }
})

export default RouteChangelogs
