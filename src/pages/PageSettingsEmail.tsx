import { Theme } from '@material-ui/core/styles'
import Email from '@material-ui/icons/Email'
import { createStyles, withStyles, WithStyles } from '@material-ui/styles'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    root: { paddingTop: spacing.unit * 10 }
  })
}

interface Props extends WithStyles<typeof styles> {}

class PageSettingsEmail extends Component<Props> {
  public render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <UnderDevelopment
          Icon={Email}
          title={'メールアドレスの更新'}
          description={
            'メールアドレスまたはユーザIDを更新する機能を開発しています。'
          }
        />
      </div>
    )
  }
}

export default withStyles(styles)(PageSettingsEmail)
