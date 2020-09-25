import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  onClose: () => void
  open: boolean
}

export const DialogMenu: FunctionComponent<Props> = ({ onClose, open }) => {
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
              <ListItemText primary={'タイムライン'} />
            </ListItem>
          </Link>
          <Link to={'/archives'}>
            <ListItem button onClick={onClose}>
              <ListItemText primary={'過去ログ'} />
            </ListItem>
          </Link>
          <Link to={'/threads'}>
            <ListItem button onClick={onClose}>
              <ListItemText primary={'スレッド'} />
            </ListItem>
          </Link>
          <Link to={'/photos'}>
            <ListItem button onClick={onClose}>
              <ListItemText primary={'画像'} />
            </ListItem>
          </Link>
          <Link to={'/changelogs'}>
            <ListItem button onClick={onClose}>
              <ListItemText primary={'アップデート履歴'} />
            </ListItem>
          </Link>
          <a
            href={
              'https://twitter.com/messages/compose?recipient_id=806076986682548224'
            }
            target={'_blank'}
            rel="noopener noreferrer"
          >
            <ListItem button onClick={onClose}>
              <ListItemText primary={'TwitterでDMを送る'} />
            </ListItem>
          </a>
          <a
            href={'https://github.com/swimmy/swimmy/issues/new'}
            target={'_blank'}
            rel="noopener noreferrer"
          >
            <ListItem button onClick={onClose}>
              <ListItemText primary={'ISSUEをつくる'} />
            </ListItem>
          </a>
          <Link to={'/privacy'}>
            <ListItem button onClick={onClose}>
              <ListItemText primary={'プライバシーポリシー'} />
            </ListItem>
          </Link>
        </List>
      </DialogContent>
    </Dialog>
  )
}
