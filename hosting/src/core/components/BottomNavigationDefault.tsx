import HomeIcon from '@mui/icons-material/Home'
import ImageIcon from '@mui/icons-material/Image'
import InboxIcon from '@mui/icons-material/Inbox'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {
  BottomNavigation,
  BottomNavigationAction,
  Divider,
  Paper,
} from '@mui/material'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

export const BottomNavigationDefault: FunctionComponent = () => {
  const history = useHistory()

  const location = useLocation()

  const [value, setValue] = useState(() => {
    if (location.pathname.includes('threads')) {
      return '/threads'
    }

    if (location.pathname.includes('photos')) {
      return '/photos'
    }

    if (location.pathname.includes('others')) {
      return '/others'
    }

    if (location.pathname.includes('search')) {
      return '/search'
    }

    return '/'
  })

  return (
    <Paper
      elevation={0}
      sx={{
        bottom: 0,
        left: 0,
        paddingBottom: 'env(safe-area-inset-bottom)',
        position: 'fixed',
        width: '100%',
        '@media screen and (max-height: 520px)': { display: 'none' },
      }}
    >
      <Divider />
      <BottomNavigation
        onChange={(_, _value) => {
          logEvent(getAnalytics(), 'select_content', {
            content_id: _value,
            content_type: 'bottom_navigation',
          })
          history.push(_value)
          setValue(_value)
        }}
        value={value}
      >
        <BottomNavigationAction
          icon={<HomeIcon />}
          label={'ホーム'}
          value={'/'}
        />
        <BottomNavigationAction
          icon={<InboxIcon />}
          label={'スレッド'}
          value={'/threads'}
        />
        <BottomNavigationAction
          icon={<ImageIcon />}
          label={'写真'}
          value={'/photos'}
        />
        <BottomNavigationAction
          icon={<MoreHorizIcon />}
          label={'その他'}
          value={'/others'}
        />
      </BottomNavigation>
    </Paper>
  )
}
