import { Drawer, List, ListItem, ListItemText, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useEffect, useState } from 'react'
import ListItemSkeleton from '../../skeleton/ListItemSkeleton'
import { useHomeThreads } from '../hooks/useHomeThreads'
import { useHomeThreadsLimit } from '../hooks/useHomeThreadsLimit'
import ListItemThread from './ListItemThread'

type Props = { threadId: string }

const DrawerThread: FunctionComponent<Props> = ({ threadId }) => {
  const [limit, setLimit] = useHomeThreadsLimit()

  const [posts] = useHomeThreads(limit)

  const [loading, setLoading] = useState(posts.length === 0)

  const classes = useStyles()

  useEffect(() => {
    if (posts.length === 0) return
    setLoading(false)
  }, [posts.length])

  const onLoadNext = () => {
    setLoading(true)
    setLimit(_limit => _limit + 24)
  }

  const skeletons = loading && posts.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : []

  const renderNext = posts.length !== 0 && limit < 200

  return (
    <Drawer
      open={true}
      classes={{ paper: classes.drawerPaper }}
      variant={'persistent'}
    >
      <List disablePadding>
        {skeletons.map(n => (
          <ListItemSkeleton key={n} />
        ))}
        {posts.map(post => (
          <ListItemThread
            key={post.id}
            post={post}
            selected={threadId === post.id}
          />
        ))}
        {renderNext && (
          <ListItem button disabled={loading}>
            <ListItemText
              onClick={() => {
                if (loading) return
                onLoadNext()
              }}
              primary={'さらに読み込む'}
            />
          </ListItem>
        )}
      </List>
    </Drawer>
  )
}

const useStyles = makeStyles<Theme>(({ shadows, breakpoints, spacing }) => {
  return {
    drawerPaper: {
      boxShadow: shadows[1],
      height: '100%',
      position: 'fixed',
      width: spacing(50),
      zIndex: 1300 - 1,
    },
  }
})

export default DrawerThread
