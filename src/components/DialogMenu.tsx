import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import DataUsage from '@material-ui/icons/DataUsage'
import Email from '@material-ui/icons/Email'
import Home from '@material-ui/icons/Home'
import PhotoIcon from '@material-ui/icons/Photo'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import PriorityHigh from '@material-ui/icons/PriorityHigh'
import Update from '@material-ui/icons/Update'
import VpnKey from '@material-ui/icons/VpnKey'
import { auth } from 'firebase/app'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { useAuthUser } from '../auth/useAuthUser'

type Props = {
  onClose: any
  isOpen: boolean
}

const DialogMenu: FunctionComponent<Props> = ({ onClose, isOpen }) => {
  const [authUser] = useAuthUser()

  const onSignOut = () => {
    auth()
      .signOut()
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <DialogActions style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <Button onClick={onClose} aria-label={'Close this menu'}>
          {'CLOSE'}
        </Button>
      </DialogActions>
      <DialogContent>
        <List component={'nav'}>
          <Link to={'/'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary={'ホーム'} />
            </ListItem>
          </Link>
          <Link to={'/stats'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <DataUsage />
              </ListItemIcon>
              <ListItemText primary={'集計データ'} />
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
          <Link to={'/changelogs'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <Update />
              </ListItemIcon>
              <ListItemText primary={'アップデート'} />
            </ListItem>
          </Link>
          <Link to={'/policy'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <PriorityHigh />
              </ListItemIcon>
              <ListItemText primary={'プライバシーポリシー'} />
            </ListItem>
          </Link>
        </List>
        {authUser && (
          <List subheader={<ListSubheader>{'アカウント'}</ListSubheader>}>
            <Link to={'/settings/email'}>
              <ListItem button onClick={onClose}>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText primary={'メールアドレスの更新'} />
              </ListItem>
            </Link>
            <Link to={'/settings/password'}>
              <ListItem button onClick={onClose}>
                <ListItemIcon>
                  <VpnKey />
                </ListItemIcon>
                <ListItemText primary={'パスワードの更新'} />
              </ListItem>
            </Link>
            <ListItem button onClick={onSignOut}>
              <ListItemIcon>
                <PowerSettingsNew />
              </ListItemIcon>
              <ListItemText primary={'ログアウト'} />
            </ListItem>
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogMenu
