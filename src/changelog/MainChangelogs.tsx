import { Theme, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { useContents } from '../microcms/useContents'
import { FragmentHead } from '../web/FragmentHead'
import { CardChangelog } from './components/CardChangelog'
import { Changelog } from './types/changelog'

export const MainChangelogs: FunctionComponent = () => {
  const classes = useStyles()

  const { data, loading } = useContents<Changelog>('changelogs')

  return (
    <main className={classes.main}>
      <FragmentHead title={'更新履歴'} />
      <Toolbar />
      <ul className={classes.list}>
        {loading && (
          <li>
            <Typography>{'読み込み中 ..'}</Typography>
          </li>
        )}
        {(data?.contents || []).map(content => (
          <li key={content.id}>
            <CardChangelog changelog={content} />
          </li>
        ))}
      </ul>
      <Toolbar />
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    main: {
      display: 'grid',
      gridGap: spacing(2),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(2),
    },
    list: {
      display: 'grid',
      gridGap: spacing(2),
    },
  }
})
