import { Divider, List, ListItem, ListItemText } from '@material-ui/core'
import { analytics } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ListItemSkeleton from '../skeleton/ListItemSkeleton'
import ListItemThread from './components/ListItemThread'
import { useHomeThreads } from './hooks/useHomeThreads'
import { useHomeThreadsLimit } from './hooks/useHomeThreadsLimit'

const ListHome: FunctionComponent = () => {
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
    setLimit(_limit => _limit + 24)
  }

  const skeletons = loading && posts.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : []

  const renderNext = posts.length !== 0 && limit < 200

  const onClick = () => {
    analytics().logEvent('select_content', {
      content_id: 'threads',
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
      <Link to={'/threads'} onClick={onClick}>
        <ListItem button>
          <ListItemText primary={'スレッド'} />
        </ListItem>
      </Link>
      <Divider />
      <Link to={'/images'}>
        <ListItem
          button
          onClick={() => {
            analytics().logEvent('select_content', {
              content_id: 'images',
              content_type: 'list_item',
              current_screen_name: window.location.pathname,
            })
          }}
        >
          <ListItemText primary={'フォト'} />
        </ListItem>
      </Link>
      <Divider />
      <Link to={'/others'}>
        <ListItem
          button
          onClick={() => {
            analytics().logEvent('select_content', {
              content_id: 'others',
              content_type: 'list_item',
              current_screen_name: window.location.pathname,
            })
          }}
        >
          <ListItemText primary={'その他'} />
        </ListItem>
      </Link>
      <Divider />
      <div style={{ height: 40 }} />
      <Divider />
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
        <ListItem
          button
          disabled={loading}
          onClick={() => {
            analytics().logEvent('tap_to_read_next_threads', {
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

export default ListHome
