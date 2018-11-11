import withStyles from '@material-ui/core/styles/withStyles'
import Search from '@material-ui/icons/Search'
import React from 'react'
import { UnderDevelopment } from '../components/UnderDevelopment'

class Component extends React.Component<any, any> {
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

const styles = ({ spacing }) => ({
  root: { paddingTop: spacing.unit * 10 }
})

export const PageSearch = withStyles(styles)(Component)
