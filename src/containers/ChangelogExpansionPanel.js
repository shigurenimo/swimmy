import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import React, { Component } from 'react'

class ChangelogExpansionPanel extends Component<any, any> {
  state = {}

  render() {
    const { classes, version, description, date } = this.props

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.version}>{version}</Typography>
          <Typography className={classes.date}>{date}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography className={classes.description}>{description}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

const styles = createStyles({
  version: {
    flexBasis: '33.33%',
    flexShrink: 0
  },
  date: {
    opacity: 0.65,
    fontSize: 12
  },
  description: {
    whiteSpace: 'pre-line',
    wordBreak: 'break-alls'
  }
})

export default withStyles(styles)(ChangelogExpansionPanel)
