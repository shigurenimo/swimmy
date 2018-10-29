import withStyles from '@material-ui/core/styles/withStyles'
import Info from '@material-ui/icons/Info'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

class PageAbout extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <UnderDevelopment
          Icon={Info}
          title={'トリセツ'}
          description={
            'このサービスの仕組みや使い方を確認できる機能を開発しています。'
          }
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

export default withStyles(styles)(PageAbout)
