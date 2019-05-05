import Email from '@material-ui/icons/Email'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import Head from '../components/Head'
import Header from '../components/Header'
import UnderDevelopment from '../components/UnderDevelopment'
import { Theme } from '@material-ui/core'

const RouteSettingsEmail: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <Fragment>
      <Head title={'メールアドレスの更新'} />
      <Header />
      <div className={classes.root}>
        <UnderDevelopment
          Icon={Email}
          title={'メールアドレスの更新'}
          description={
            'メールアドレスまたはユーザIDを更新する機能を開発しています。'
          }
        />
      </div>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return { root: { paddingTop: spacing(10) } }
})

export default RouteSettingsEmail
