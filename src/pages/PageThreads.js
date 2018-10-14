import withStyles from '@material-ui/core/styles/withStyles'
import TurnedIn from '@material-ui/icons/TurnedIn'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

class PageThreads extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <UnderDevelopment
          Icon={TurnedIn}
          title={'スレッド'}
          description={
            'スレッドを検索する機能を開発しています。'
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

export default withStyles(styles)(PageThreads)
