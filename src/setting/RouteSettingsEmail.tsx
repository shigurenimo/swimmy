import { Theme } from '@material-ui/core'
import Email from '@material-ui/icons/Email'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import Header from '../components/AppBarDefault'
import DivUnderDevelopment from '../components/DivUnderDevelopment'
import FragmentHead from '../components/FragmentHead'

const RouteSettingsEmail: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <Fragment>
      <FragmentHead title={'メールアドレスの更新'} />
      <Header />
      <div className={classes.root}>
        <DivUnderDevelopment
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
