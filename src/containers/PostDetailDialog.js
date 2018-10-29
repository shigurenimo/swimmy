import Button from '@material-ui/core/Button/Button'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogActions from '@material-ui/core/DialogActions/DialogActions'
import DialogContent from '@material-ui/core/DialogContent/DialogContent'
import List from '@material-ui/core/List/List'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component } from 'react'
import ReplyPostlistItem from '../components/ReplyPostlistItem'

class PostDetailDialog extends Component<any, any> {
  render() {
    const { onClose, isOpen, posts, inProgress, classes } = this.props

    return (
      <Dialog fullScreen open={isOpen} onClose={onClose}>
        <DialogActions>
          <Button onClick={onClose}>CLOSE</Button>
        </DialogActions>
        {inProgress && <CircularProgress className={classes.progress} />}
        <DialogContent>
          <List className={classes.list}>
            {posts.map(post => (
              <ReplyPostlistItem key={post.id} post={post} />
            ))}
          </List>
        </DialogContent>
      </Dialog>
    )
  }
}

const styles = createStyles({
  root: {},
  posts: {},
  progress: {
    display: 'block',
    marginTop: 80,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  list: {
    paddingBottom: 40
  }
})

export default withStyles(styles)(PostDetailDialog)
