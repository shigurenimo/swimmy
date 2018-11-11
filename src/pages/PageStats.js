import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Equalizer from '@material-ui/icons/Equalizer'
import React from 'react'
import { UnderDevelopment } from '../components/UnderDevelopment'

class Component extends React.Component<any, any> {
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

const styles = ({ spacing }) =>
  createStyles({
    root: { paddingTop: spacing.unit * 10 }
  })

export const PageStats = withStyles(styles)(Component)
