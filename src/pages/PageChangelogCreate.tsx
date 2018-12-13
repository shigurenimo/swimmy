import { Theme } from '@material-ui/core/styles'
import { createStyles, withStyles, WithStyles } from '@material-ui/styles'
import React, { Component } from 'react'
import FormChangelogCreate from '../components/FormChangelogCreate'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    root: {
      margin: 'auto',
      maxWidth: spacing.unit * 100,
      paddingTop: spacing.unit * 10,
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2
    }
  })
}

interface Props extends WithStyles<typeof styles> {}

class PageChangelogCreate extends Component<Props> {
  public render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <FormChangelogCreate />
      </div>
    )
  }
}

export default withStyles(styles)(PageChangelogCreate)
