import withStyles from '@material-ui/core/styles/withStyles'
import Search from '@material-ui/icons/Search'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

class PageSearch extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <UnderDevelopment
          Icon={Search}
          title={'フルテキスト検索'}
          description={'過去の書き込みから全文検索できる機能を開発しています。'}
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

export default withStyles(styles)(PageSearch)
