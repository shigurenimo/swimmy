import { CircularProgress, Fade } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import CardChangelog from '../components/CardChangelog'
import Header from '../components/Header'
import SectionTitle from '../components/SectionTitle'
import { usePrismicChangelogs } from '../hooks/usePrismicChangelogs'
import { px } from '../libs/px'
import { resetList } from '../libs/resetList'

const RouteChangelogs: FunctionComponent = () => {
  const classes = useStyles({})
  const [[changelogs, inProgress]] = usePrismicChangelogs()

  if (inProgress) {
    return <CircularProgress className={classes.progress} />
  }

  return (
    <Fragment>
      <Header />
      <Fade in>
        <main className={classes.root}>
          <SectionTitle
            hide={false}
            title={'アップデート履歴'}
            description={
              'バージョン3.0.0以降の過去のアップデート履歴を確認できます。'
            }
          />
          <ul className={classes.changelogs}>
            {changelogs.map(changelog => (
              <li key={changelog.version}>
                <CardChangelog changelog={changelog} />
              </li>
            ))}
          </ul>
        </main>
      </Fade>
    </Fragment>
  )
}

const useStyles = makeStyles(({ spacing }) => {
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
