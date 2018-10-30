import Button from '@material-ui/core/Button/Button'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogActions from '@material-ui/core/DialogActions/DialogActions'
import DialogContent from '@material-ui/core/DialogContent/DialogContent'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader'
import BugReport from '@material-ui/icons/BugReport'
import Code from '@material-ui/icons/Code'
import Email from '@material-ui/icons/Email'
import Equalizer from '@material-ui/icons/Equalizer'
import Home from '@material-ui/icons/Home'
import Info from '@material-ui/icons/Info'
import Search from '@material-ui/icons/Search'
import Update from '@material-ui/icons/Update'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import VpnKey from '@material-ui/icons/VpnKey'
import { auth } from 'firebase/app'
import React from 'react'
import { Link } from 'react-router-dom'
import { AuthConsumer } from '../contexts/auth'

class Component extends React.Component {
  render() {
    const { onClose, isOpen } = this.props

    return (
      <Dialog fullScreen open={isOpen} onClose={onClose}>
        <DialogActions>
          <Button onClick={onClose}>CLOSE</Button>
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
            <Link to={'/issues'}>
              <ListItem button onClick={onClose}>
                <ListItemIcon>
                  <BugReport />
                </ListItemIcon>
                <ListItemText inset primary="バグレポート" />
              </ListItem>
            </Link>
            <Link to={'/about'}>
              <ListItem button onClick={onClose}>
                <ListItemIcon>
                  <Info />
                </ListItemIcon>
                <ListItemText inset primary="トリセツ" />
              </ListItem>
            </Link>
            <Link to={'/development'}>
              <ListItem button onClick={onClose}>
                <ListItemIcon>
                  <Code />
                </ListItemIcon>
                <ListItemText inset primary="開発" />
              </ListItem>
            </Link>
          </List>
          <AuthConsumer>
            {auth =>
              auth.isLogged && (
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
                  <ListItem button onClick={this.onSignOut}>
                    <ListItemIcon>
                      <PowerSettingsNew />
                    </ListItemIcon>
                    <ListItemText inset primary="サインアウト" />
                  </ListItem>
                </List>
              )
            }
          </AuthConsumer>
        </DialogContent>
      </Dialog>
    )
  }

  onSignOut = () => {
    auth()
      .signOut()
      .catch(err => {
        console.error(err)
      })
  }
}

export const AppMenuDialog = Component
