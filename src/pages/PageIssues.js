import withStyles from '@material-ui/core/styles/withStyles'
import BugReport from '@material-ui/icons/BugReport'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

class PageIssues extends Component<any, any> {
  render() {
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

const styles = () => ({
  root: {
    paddingTop: '40%'
  }
})

export default withStyles(styles)(PageIssues)
