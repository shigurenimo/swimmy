import withStyles from '@material-ui/core/styles/withStyles'
import Equalizer from '@material-ui/icons/Equalizer'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

class PageStats extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <UnderDevelopment
          Icon={Equalizer}
          title={'統計データ'}
          description={
            '書き込みやユーザの状況を確認できる機能を開発しています。'
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

export default withStyles(styles)(PageStats)
