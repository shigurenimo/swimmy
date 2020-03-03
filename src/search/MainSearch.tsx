import { Divider, Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import DivSkeleton from '../skeleton/DivSkeleton'
import FragmentHead from '../web/FragmentHead'
import { useAnalytics } from '../web/useAnalytics'
import FormDate from './components/FormDate'
import LinkThread from './components/LinkThread'
import { useEarly } from './hooks/useEarly'
import { useMonth } from './hooks/useMonth'
import { useSearchThreads } from './hooks/useSearchThreads'
import { useYear } from './hooks/useYear'

const MainSearch: FunctionComponent = () => {
  const [year, setYear] = useYear()

  const [month, setMonth] = useMonth()

  const [early, setEarly] = useEarly()

  const [posts, loading] = useSearchThreads(year, month, early)

  const classes = useStyles()

  useAnalytics()

  const skeletons = loading ? [0, 1, 2, 3, 4, 5, 6] : []

  return (
    <main className={classes.root}>
      <FragmentHead title={'探す'} />
      <Toolbar />
      <FormDate
        monthState={[month, setMonth]}
        yearState={[year, setYear]}
        earlyState={[early, setEarly]}
      />
      <ul className={classes.posts}>
        {skeletons.map(n => (
          <li key={n}>
            <DivSkeleton />
            <Divider />
          </li>
        ))}
        {posts.map(post => (
          <li key={post.id}>
            <LinkThread post={post} />
            <Divider />
          </li>
        ))}
      </ul>
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    posts: { display: 'grid' },
    root: { display: 'grid', gridGap: spacing(2) },
    next: {
      alignItems: 'center',
      display: 'grid',
      gridAutoColumns: 'max-content',
      justifyContent: 'center',
      padding: spacing(2),
    },
  }
})

export default MainSearch
