import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { createStyles, withStyles, WithStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { Component } from 'react'
import { collectionData } from 'rxfire/firestore'
import { Subscription } from 'rxjs'
import { take } from 'rxjs/operators'
import ChartLine from '../components/ChartLine'
import PageTitle from '../components/PageTitle'
import { STATS } from '../constants/collection'
import { px } from '../libs/styles/px'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing.unit * 10
    },
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2)
    },
    section: {
      display: 'grid',
      gridRowGap: px(spacing.unit),
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2
    }
  })
}

interface Props extends WithStyles<typeof styles> {}

interface State {
  stats: any
  chartData: any
  averagePerDay: number
  countTotal: number
  countWeek: number
  inProgress: boolean
}

class PageStats extends Component<Props> {
  public state: State = {
    averagePerDay: 0,
    chartData: null,
    countTotal: 0,
    countWeek: 0,
    inProgress: true,
    stats: null
  }
  private subscription?: Subscription
  private isUnmounted = false

  public render() {
    const { classes } = this.props
    const {
      chartData,
      inProgress,
      countTotal,
      countWeek,
      averagePerDay
    } = this.state
    if (inProgress) {
      return <CircularProgress className={classes.progress} />
    }
    return (
      <Fade in>
        <main className={classes.root}>
          <PageTitle
            hide={false}
            title={'統計データ'}
            description={'ちょっとした統計データをこのページで確認できます。'}
          />
          <section className={classes.section}>
            <Card>
              <CardContent>
                <Typography>1日の平均の書き込み</Typography>
                <Typography variant={'h3'}>{averagePerDay}</Typography>
              </CardContent>
            </Card>
          </section>
          <section className={classes.section}>
            <Card>
              <CardContent>
                <Typography>今までの書き込み</Typography>
                <Typography variant={'h3'}>{countTotal}</Typography>
              </CardContent>
            </Card>
          </section>
          <section className={classes.section}>
            <Card>
              <CardContent>
                <Typography>100日間の書き込み</Typography>
                <Typography variant={'h3'}>{countWeek}</Typography>
              </CardContent>
            </Card>
          </section>
          <section className={classes.section}>
            <Card>
              <ChartLine data={chartData} />
            </Card>
          </section>
        </main>
      </Fade>
    )
  }

  public componentDidMount() {
    this.subscription = this.subscribeStats()
  }

  public componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  private subscribeStats() {
    const query = firestore()
      .collection(STATS)
      .orderBy('timestamp', 'desc')
    return collectionData<any>(query)
      .pipe(take(2))
      .subscribe(docs => {
        if (this.isUnmounted) {
          return
        }
        const sum = (a: any, b: any) =>
          a.postCount ? a.postCount : a + b.postCount
        const countTotal = docs.reduce(sum)
        const countWeek = docs.filter((_, i) => i < 100).reduce(sum)
        const averagePerDay = (countTotal / docs.length).toFixed(0)
        const chartData = [
          {
            id: 'post',
            data: docs
              .filter((_, i) => i < 100)
              .map(doc => {
                return { x: doc.time, y: doc.postCount }
              })
          }
        ]
        this.setState({
          averagePerDay,
          chartData,
          countTotal,
          countWeek,
          inProgress: false
        })
      })
  }
}

export default withStyles(styles)(PageStats)
