import { Theme } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { WithStyles } from '@material-ui/styles/withStyles'
import React, { Component } from 'react'
import ExpansionPanelSummaryPost from '../components/ExpansionPanelSummaryPost'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { px } from '../libs/styles/px'

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: { padding: px(spacing.unit * 2) }
  })

interface Props extends WithStyles<typeof styles> {
  post: PostUi[]
}

interface State {
  inProgressLike: boolean
}

class ListItemPost extends Component<any, State> {
  isUnmounted = false
  state = { inProgressLike: true }

  render() {
    const { classes, post } = this.props

    return (
      <div className={classes.root}>
        <ExpansionPanelSummaryPost post={post} />
      </div>
    )
  }
}

export default withStyles(styles)(ListItemPost)
