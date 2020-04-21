import { Divider, Theme, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import FragmentHead from '../web/FragmentHead'
import { useAnalytics } from '../web/useAnalytics'
import LinkThread from './components/LinkThread'
import { useArchiveThreads } from './hooks/useArchiveThreads'

type Params = {
  month: string
  year: string
}

const MainThreadArchive: FunctionComponent = () => {
  const classes = useStyles()

  const { year, month } = useParams<Params>()

  const [threads = []] = useArchiveThreads(parseInt(year), parseInt(month))

  useAnalytics()

  return (
    <main className={classes.main}>
      <FragmentHead title={'過去ログ'} />
      <Toolbar />
      <section className={classes.pageTitle}>
        <Typography style={{ fontWeight: 'bold' }} variant={'h5'}>
          {`${year}年 ${month}月`}
        </Typography>
      </section>
      <ul>
        {threads.map(thread => (
          <li key={thread.id}>
            <LinkThread post={thread} />
            <Divider />
          </li>
        ))}
      </ul>
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    main: {
      display: 'grid',
      gridGap: spacing(2),
    },
    pageTitle: {
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
    },
  }
})

export default MainThreadArchive
