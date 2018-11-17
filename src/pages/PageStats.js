import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import { firestore } from 'firebase/app'
import React from 'react'
import { collectionData } from 'rxfire/firestore'
import { take } from 'rxjs/operators'
import { ChartLine } from '../components/ChartLine'
import { PageTitle } from '../components/PageTitle'
import { STATS } from '../constants/collection'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
  subscription = null
  isUnmounted = false
  state = {
    stats: null,
    chartData: null,
    averagePerDay: 0,
    countTotal: 0,
    countWeek: 0,
    inProgress: true
  }

  render() {
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

  componentDidMount() {
    this.subscription = this.subscribeStats()
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  subscribeStats() {
    const query = firestore()
      .collection(STATS)
      .orderBy('timestamp', 'desc')
    return collectionData(query)
      .pipe(take(2))
      .subscribe(docs => {
        if (this.isUnmounted) return
        const sum = (a, b) => (a.postCount ? a.postCount : a + b.postCount)
        const countTotal = docs.reduce(sum)
        const countWeek = docs.filter((_, i) => i < 100).reduce(sum)
        const averagePerDay = (countTotal / docs.length).toFixed(0)
        const chartData = [
          {
            id: 'post',
            data: docs.filter((_, i) => i < 100).map(doc => {
              return { x: doc.time, y: doc.postCount }
            })
          }
        ]
        this.setState({
          inProgress: false,
          averagePerDay,
          countTotal,
          countWeek,
          chartData
        })
      })
  }
}

const styles = ({ spacing }) =>
  createStyles({
    progress: {
      display: 'block',
      marginTop: spacing.unit * 10,
      marginLeft: 'auto',
      marginRight: 'auto'
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

export const PageStats = withStyles(styles)(Component)
