import { Theme } from '@material-ui/core/styles'
import Search from '@material-ui/icons/Search'
import { withStyles, WithStyles } from '@material-ui/styles'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

const styles = ({ spacing }: Theme) => ({
  root: { paddingTop: spacing.unit * 10 }
})

interface Props extends WithStyles<typeof styles> {}

class PageSearch extends Component<Props> {
  public render() {
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

export default withStyles(styles)(PageSearch)
