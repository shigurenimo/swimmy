import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Info from '@material-ui/icons/Info'
import React from 'react'
import { UnderDevelopment } from '../components/UnderDevelopment'

class Component extends React.Component<any, any> {
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

const styles = ({ spacing }) =>
  createStyles({
    root: { paddingTop: spacing.unit * 10 }
  })

export const PageAbout = withStyles(styles)(Component)
