import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component } from 'react'
import PostExpansionPanelSummary from '../components/PostExpansionPanelSummary'

class ThreadExpansionPanel extends Component<any, any> {
  state = {}

  render() {
    const { classes, post } = this.props

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary className={classes.summary}>
          <PostExpansionPanelSummary post={post} />
        </ExpansionPanelSummary>
      </ExpansionPanel>
    )
  }
}

const styles = createStyles({
  root: {
    width: '100%'
  },
  summary: {
    padding: '0 12px'
  }
})

export default withStyles(styles)(ThreadExpansionPanel)
