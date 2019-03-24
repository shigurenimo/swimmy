import { CircularProgress, Fade } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import CardChangelog from '../components/CardChangelog'
import ViewTitle from '../components/ViewTitle'
import { usePrismicChangelogs } from '../hooks/usePrismicChangelogs'
import { px } from '../libs/styles/px'
import { resetList } from '../libs/styles/resetList'

const RouteChangelogs: FunctionComponent = () => {
  const classes = useStyles({})
  const [[changelogs, inProgress]] = usePrismicChangelogs()

  if (inProgress) {
    return <CircularProgress className={classes.progress} />
  }

  return (
    <Fade in>
      <main className={classes.root}>
        <ViewTitle
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
