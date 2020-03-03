import { Divider, Theme, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import FragmentHead from '../web/FragmentHead'
import { useAnalytics } from '../web/useAnalytics'

const MainPrivacy: FunctionComponent = () => {
  const classes = useStyles()

  useAnalytics()

  return (
    <main className={classes.root}>
      <FragmentHead title={'プライバシーポリシー'} />
      <Toolbar />
      <Divider />
      <section className={classes.section}>
        <Typography variant={'h6'} component={'h2'}>
          個人情報について
        </Typography>
        <Typography className={classes.description}>
          個人情報とは、このサービスを利用するユーザの情報のうち、メールアドレスなど、個人を特定できる情報をいいます。
          また、他の情報と容易に照合でき、それにより個人を特定できる情報も含みます。
        </Typography>
      </section>
      <Divider />
      <section className={classes.section}>
        <Typography variant={'h6'} component={'h2'}>
          個人情報の管理と利用
        </Typography>
        <Typography className={classes.description}>
          Swimmyは、ログイン認証にメールアドレスの利用を希望するユーザのメールアドレスを管理します。
          Swimmyは、ユーザのログイン認証のみにメールアドレスを利用します。
        </Typography>
      </section>
      <Divider />
      <section className={classes.section}>
        <Typography variant={'h6'} component={'h2'}>
          個人情報の提供
        </Typography>
        <Typography className={classes.description}>
          Swimmyは、個人情報を第三者に提供しません。
        </Typography>
      </section>
      <Divider />
      <section className={classes.section}>
        <Typography variant={'h6'} component={'h2'}>
          Cookieの使用
        </Typography>
        <Typography className={classes.description}>
          Swimmyは、Google
          Analyticsを使用しトラフィックデータの収集のためにCookieを使用します。
          これは匿名で収集されており、個人を特定するものではありません。
        </Typography>
      </section>
      <Divider />
      <section className={classes.section}>
        <Typography variant={'h6'} component={'h2'}>
          プライバシーポリシーへの同意
        </Typography>
        <Typography className={classes.description}>
          ユーザがこのサービスを利用することで、このプライバシーポリシーに同意したものとします。
        </Typography>
      </section>
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    description: { whiteSpace: 'pre-line', wordBreak: 'break-all' },
    root: { display: 'grid' },
    section: {
      display: 'grid',
      gridRowGap: spacing(1),
      paddingBottom: spacing(2),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(2),
    },
  }
})

export default MainPrivacy
