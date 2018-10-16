import ListItem from '@material-ui/core/ListItem/ListItem'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import React from 'react'

const ReplyPostlistItem = ({ post }) => (
  <ListItem button divider>
    <div>
      <Typography gutterBottom>{post.text}</Typography>
      <Typography variant={'caption'} color={'textSecondary'}>
        {post.ui.createdAt}
      </Typography>
    </div>
  </ListItem>
)

const styles = () => ({
  root: {}
})

export default withStyles(styles)(ReplyPostlistItem)
