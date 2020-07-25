import {
  BottomNavigation,
  BottomNavigationAction,
  Divider,
  Paper,
  Theme,
} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import ImageIcon from '@material-ui/icons/Image'
import InboxIcon from '@material-ui/icons/Inbox'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { makeStyles } from '@material-ui/styles'
import { analytics } from 'firebase/app'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

export const BottomNavigationDefault: FunctionComponent = ({ children }) => {
  const classes = useStyles()

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

  const onChange = (_: ChangeEvent, _value: string) => {
    analytics().logEvent('select_content', {
      content_id: _value,
      content_type: 'bottom_navigation',
    })
    history.push(_value)
    setValue(_value)
  }

  return (
    <Paper elevation={0} className={classes.root}>
      <Divider />
      <BottomNavigation component={'footer'} onChange={onChange} value={value}>
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

const useStyles = makeStyles<Theme>(() => {
  return {
    root: {
      bottom: 0,
      left: 0,
      paddingBottom: 'env(safe-area-inset-bottom)',
      position: 'fixed',
      width: '100%',
      '@media screen and (max-height: 520px)': { display: 'none' },
    },
  }
})
