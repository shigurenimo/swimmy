import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component } from 'react'
import ChangelogExpansionPanel from '../containers/ChangelogExpansionPanel'

class PageChangelogs extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <ChangelogExpansionPanel
          version={'3.0.1'}
          date={'2018年10月15日'}
          description={`- 開発予定のページの説明を追加
          - 書き込みの日付が間違っているバグを修正`}
        />
        <ChangelogExpansionPanel
          version={'3.0.0'}
          date={'2018年10月15日'}
          description={'色んな機能がなくなりました'}
        />
      </div>
    )
  }
}

const styles = () => ({
  root: {
    width: '100%'
  }
})

export default withStyles(styles)(PageChangelogs)
