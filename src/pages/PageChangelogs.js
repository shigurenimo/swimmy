import withStyles from '@material-ui/core/styles/withStyles'
import Update from '@material-ui/icons/Update'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

class PageChangelogs extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <UnderDevelopment
          Icon={Update}
          title={'アップデート'}
          description={
            'このサービスのアップデート履歴を確認する機能を開発しています。'
          }
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

export default withStyles(styles)(PageChangelogs)
