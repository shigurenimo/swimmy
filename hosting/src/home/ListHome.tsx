import { Divider, List, ListItem, ListItemText } from '@material-ui/core'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ListItemThread } from 'src/home/components/ListItemThread'
import { useHomeThreads } from 'src/home/hooks/useHomeThreads'
import { useHomeThreadsLimit } from 'src/home/hooks/useHomeThreadsLimit'
import { ListItemSkeleton } from 'src/post/ListItemSkeleton'

export const ListHome: FunctionComponent = () => {
  const [limit, setLimit] = useHomeThreadsLimit()

  const [posts] = useHomeThreads(limit)

  const [loading, setLoading] = useState(posts.length === 0)

  const { threadId } = useParams<{ threadId: string }>()

  useEffect(() => {
    if (posts.length === 0) return
    setLoading(false)
  }, [posts.length])

  const onLoadNext = () => {
    setLoading(true)
    setLimit((_limit) => _limit + 24)
  }

  const skeletons = loading && posts.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : []

  const renderNext = posts.length !== 0 && limit < 200

  const onClick = (content_id: string) => () => {
    logEvent(getAnalytics(), 'select_content', {
      content_id,
      content_type: 'list_item',
      current_screen_name: window.location.pathname,
    })
  }

  return (
    <List disablePadding>
      <ListItem disabled>
        <ListItemText primary={'ホーム'} />
      </ListItem>
      <Divider />
      <Link to={'/threads'} onClick={onClick('threads')}>
        <ListItem button>
          <ListItemText primary={'スレッド'} />
        </ListItem>
      </Link>
      <Divider />
      <Link to={'/photos'} onClick={onClick('photos')}>
        <ListItem button>
          <ListItemText primary={'フォト'} />
        </ListItem>
      </Link>
      <Divider />
      <Link to={'/others'} onClick={onClick('others')}>
        <ListItem button>
          <ListItemText primary={'その他'} />
        </ListItem>
      </Link>
      <Divider />
      <div style={{ height: 40 }} />
      <Divider />
      {skeletons.map((n) => (
        <ListItemSkeleton key={n} />
      ))}
      {posts.map((post) => (
        <ListItemThread
          key={post.id}
          post={post}
          selected={threadId === post.id}
        />
      ))}
      {renderNext && (
        <ListItem
          button
          disabled={loading}
          onClick={() => {
            logEvent(getAnalytics(), 'tap_to_read_next_threads', {
              current_screen_name: window.location.pathname,
            })
          }}
        >
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
  )
}
