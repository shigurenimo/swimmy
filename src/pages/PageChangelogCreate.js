import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { FormChangelogCreate } from '../containers/FormChangelogCreate'

class Component extends React.Component<any, any> {
  state = {}

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <FormChangelogCreate />
      </div>
    )
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: {
      margin: 'auto',
      maxWidth: spacing.unit * 100,
      paddingTop: spacing.unit * 10,
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2
    }
  })

export const PageChangelogCreate = withStyles(styles)(Component)
