import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import VpnKey from '@material-ui/icons/VpnKey'
import React from 'react'
import { UnderDevelopment } from '../components/UnderDevelopment'

class Component extends React.Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <UnderDevelopment
          Icon={VpnKey}
          title={'パスワードの更新'}
          description={'パスワードを更新する機能を開発しています。'}
        />
      </div>
    )
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: { paddingTop: spacing.unit * 10 }
  })

export const PageSettingsPassword = withStyles(styles)(Component)
