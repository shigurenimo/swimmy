import { Theme } from '@material-ui/core/styles'
import BugReport from '@material-ui/icons/BugReport'
import { createStyles, withStyles, WithStyles } from '@material-ui/styles'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    root: { paddingTop: spacing.unit * 10 }
  })
}

interface Props extends WithStyles<typeof styles> {}

class PageIssues extends Component<Props> {
  public render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <UnderDevelopment
          Icon={BugReport}
          title={'バグレポート'}
          description={'機能の提案やバグの報告ができる機能を開発しています。'}
        />
      </div>
    )
  }
}

export default withStyles(styles)(PageIssues)
