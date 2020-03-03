import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import Home from '@material-ui/icons/Home'
import PhotoIcon from '@material-ui/icons/Photo'
import PriorityHigh from '@material-ui/icons/PriorityHigh'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  onClose: () => void
  open: boolean
}

const DialogMenu: FunctionComponent<Props> = ({ onClose, open }) => {
  const { breakpoints } = useTheme()

  const isMobile = useMediaQuery(breakpoints.down('sm'))

  return (
    <Dialog fullScreen={isMobile} open={open} onClose={onClose}>
      {isMobile && (
        <DialogActions>
          <Button onClick={onClose} aria-label={'Close this menu'}>
            {'閉じる'}
          </Button>
        </DialogActions>
      )}
      <DialogContent style={{ padding: 16 }}>
        <List component={'nav'} disablePadding>
          <Link to={'/'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary={'ホーム'} />
            </ListItem>
          </Link>
          <Link to={'/threads'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <ChatBubbleIcon />
              </ListItemIcon>
              <ListItemText primary={'スレッド'} />
            </ListItem>
          </Link>
          <Link to={'/images'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <PhotoIcon />
              </ListItemIcon>
              <ListItemText primary={'画像'} />
            </ListItem>
          </Link>
          <Link to={'/privacy'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <PriorityHigh />
              </ListItemIcon>
              <ListItemText primary={'プライバシーポリシー'} />
            </ListItem>
          </Link>
        </List>
      </DialogContent>
    </Dialog>
  )
}

export default DialogMenu
