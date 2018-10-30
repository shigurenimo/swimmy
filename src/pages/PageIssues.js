import withStyles from '@material-ui/core/styles/withStyles'
import BugReport from '@material-ui/icons/BugReport'
import React from 'react'
import { UnderDevelopment } from '../components/UnderDevelopment'

class Component extends React.Component<any, any> {
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
    paddingTop: '80px'
  }
})

export const PageIssues = withStyles(styles)(Component)
