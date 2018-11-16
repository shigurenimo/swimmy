import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { ExpansionPanelSummaryPost } from '../components/ExpansionPanelSummaryPost'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
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

const styles = ({ spacing }) =>
  createStyles({
    root: { padding: px(spacing.unit * 2) }
  })

export const ListItemPost = withStyles(styles)(Component)
