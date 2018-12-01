import { Theme } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { WithStyles } from '@material-ui/styles/withStyles'
import React, { Component } from 'react'
import PageTitle from '../components/PageTitle'
import { px } from '../libs/styles/px'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    root: { display: 'grid', gridRowGap: px(spacing.unit * 2) },
    section: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2
    },
    description: { whiteSpace: 'pre-line', wordBreak: 'break-all' }
  })
}

interface Props extends WithStyles<typeof styles> {}

class PagePolicy extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <main className={classes.root}>
        <PageTitle
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
    )
  }
}

export default withStyles(styles)(PagePolicy)
