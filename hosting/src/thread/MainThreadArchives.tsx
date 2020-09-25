import { Theme, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { FunctionComponent } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Post } from '../firestore/types/post'
import { FragmentHead } from '../web/FragmentHead'
import { useAnalytics } from '../web/useAnalytics'
import { CardArchive } from './components/CardArchive'
import { toArchives } from './helpers/toArchives'

export const MainThreadArchives: FunctionComponent = () => {
  const classes = useStyles()

  const [threads = []] = useCollectionData<Post>(
    firestore()
      .collection('posts-as-thread')
      .orderBy('replyPostCount', 'desc')
      .limit(600)
  )

  const archives = toArchives(threads)

  useAnalytics()

  return (
    <main className={classes.root}>
      <FragmentHead title={'過去ログ'} />
      <Toolbar />
      <ul className={classes.archives}>
        {archives.map(archive => (
          <li key={`${archive.year}-${archive.month}`}>
            <CardArchive archive={archive} />
          </li>
        ))}
      </ul>
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    archives: {
      display: 'grid',
      gridGap: spacing(2),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(2),
    },
  }
})
