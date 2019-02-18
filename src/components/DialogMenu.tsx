import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Email from '@material-ui/icons/Email'
import Equalizer from '@material-ui/icons/Equalizer'
import Home from '@material-ui/icons/Home'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import PriorityHigh from '@material-ui/icons/PriorityHigh'
import Search from '@material-ui/icons/Search'
import Update from '@material-ui/icons/Update'
import VpnKey from '@material-ui/icons/VpnKey'
import { auth } from 'firebase/app'
import React, { FunctionComponent, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/authContext'

interface Props {
  onClose: any
  isOpen: boolean
}

const DialogMenu: FunctionComponent<Props> = ({ onClose, isOpen }) => {
  const authContext = useContext(AuthContext)
  const onSignOut = () => {
    auth()
      .signOut()
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <DialogActions>
        <Button onClick={onClose} aria-label={'Close this menu'}>
          CLOSE
        </Button>
      </DialogActions>
      <DialogContent>
        <List>
          <Link to={'/'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText inset primary="ホーム" />
            </ListItem>
          </Link>
          <Link to={'/search'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <Search />
              </ListItemIcon>
              <ListItemText inset primary="検索" />
            </ListItem>
          </Link>
          <Link to={'/stats'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <Equalizer />
              </ListItemIcon>
              <ListItemText inset primary="統計" />
            </ListItem>
          </Link>
          <Link to={'/changelogs'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <Update />
              </ListItemIcon>
              <ListItemText inset primary="アップデート" />
            </ListItem>
          </Link>
          <Link to={'/policy'}>
            <ListItem button onClick={onClose}>
              <ListItemIcon>
                <PriorityHigh />
              </ListItemIcon>
              <ListItemText inset primary="プライバシーポリシー" />
            </ListItem>
          </Link>
        </List>
        {authContext.isLogged && (
          <List subheader={<ListSubheader>アカウント</ListSubheader>}>
            <Link to={'/settings/email'}>
              <ListItem button onClick={onClose}>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText inset primary="メールアドレスの更新" />
              </ListItem>
            </Link>
            <Link to={'/settings/password'}>
              <ListItem button onClick={onClose}>
                <ListItemIcon>
                  <VpnKey />
                </ListItemIcon>
                <ListItemText inset primary="パスワードの更新" />
              </ListItem>
            </Link>
            <ListItem button onClick={onSignOut}>
              <ListItemIcon>
                <PowerSettingsNew />
              </ListItemIcon>
              <ListItemText inset primary="サインアウト" />
            </ListItem>
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogMenu
