import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Header from 'app/shared/components/AppBarDefault'
import FragmentHead from 'app/shared/components/FragmentHead'
import SectionTitle from 'app/shared/components/SectionTitle'
import { px } from 'app/shared/styles/px'
import React, { Fragment, FunctionComponent } from 'react'

const RoutePolicy: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <Fragment>
      <FragmentHead title={'プライバシーポリシー'} />
      <Header />
      <main className={classes.root}>
        <SectionTitle
          hide={false}
          title={'プライバシーポリシー'}
          description={
            'このサービスを利用するユーザの情報の取り扱いについて、プライバシーポリシーを定めます。'
          }
        />
        <section className={classes.section}>
          <Typography variant={'h6'} component={'h2'}>
            個人情報について
          </Typography>
          <Typography className={classes.description}>
            個人情報とは、このサービスを利用するユーザの情報のうち、メールアドレスなど、個人を特定できる情報をいいます。
            また、他の情報と容易に照合でき、それにより個人を特定できる情報も含みます。
          </Typography>
        </section>
        <section className={classes.section}>
          <Typography variant={'h6'} component={'h2'}>
            個人情報の管理と利用
          </Typography>
          <Typography className={classes.description}>
            Swimmyは、ログイン認証にメールアドレスの利用を希望するユーザのメールアドレスを管理します。
            Swimmyは、ユーザのログイン認証のみにメールアドレスを利用します。
          </Typography>
        </section>
        <section className={classes.section}>
          <Typography variant={'h6'} component={'h2'}>
            個人情報の提供
          </Typography>
          <Typography className={classes.description}>
            Swimmyは、個人情報を第三者に提供しません。
          </Typography>
        </section>
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
        <section className={classes.section}>
          <Typography variant={'h6'} component={'h2'}>
            プライバシーポリシーへの同意
          </Typography>
          <Typography className={classes.description}>
            ユーザがこのサービスを利用することで、このプライバシーポリシーに同意したものとします。
          </Typography>
        </section>
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    description: { whiteSpace: 'pre-line', wordBreak: 'break-all' },
    root: { display: 'grid', gridRowGap: px(spacing(2)) },
    section: {
      display: 'grid',
      gridRowGap: px(spacing(2)),
      paddingLeft: spacing(2),
      paddingRight: spacing(2)
    }
  }
})

export default RoutePolicy
