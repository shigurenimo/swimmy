import Email from '@material-ui/icons/Email'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

const RouteSettingsEmail: FunctionComponent = () => {
  const classes = useStyles({})

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

const useStyles = makeStyles(({ spacing }) => {
  return { root: { paddingTop: spacing.unit * 10 } }
})

export default RouteSettingsEmail
