import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { FormIssueCreate } from '../containers/FormIssueCreate'

class Component extends React.Component<any, any> {
  state = {}

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <FormIssueCreate />
      </div>
    )
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: {
      margin: 'auto',
      maxWidth: spacing.unit * 100,
      paddingTop: spacing.unit * 10
    }
  })

export const PageChangelogCreate = withStyles(styles)(Component)
