import {
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { take } from 'rxjs/operators'
import ChartLine from '../components/ChartLine'
import SectionTitle from '../components/SectionTitle'
import { STATS } from '../constants/collection'
import { px } from '../libs/px'

const RouteStats: FunctionComponent = () => {
  const [averagePerDay, setAveragePerDay] = useState<any>(0)
  const [chartData, setChartData] = useState<any>(null)
  const [countTotal, setCountTotal] = useState(0)
  const [countWeek, setCountWeek] = useState(0)
  const [inProgress, setInProgress] = useState(true)
  const [stats, setStats] = useState(null)
  const classes = useStyles({})
  const subscribeStats = () => {
    const query = firestore()
      .collection(STATS)
      .orderBy('timestamp', 'desc')
    return collectionData<any>(query)
      .pipe(take(2))
      .subscribe(docs => {
        const sum = (a: any, b: any) =>
          a.postCount ? a.postCount : a + b.postCount
        const _countTotal = docs.reduce(sum)
        const _countWeek = docs.filter((_, i) => i < 100).reduce(sum)
        const _averagePerDay = (_countTotal / docs.length).toFixed(0)
        const _chartData = [
          {
            data: docs
              .filter((_, i) => i < 100)
              .map(doc => {
                return { x: doc.time, y: doc.postCount }
              }),
            id: 'post'
          }
        ]
        setAveragePerDay(_averagePerDay)
        setChartData(_chartData)
        setCountTotal(_countTotal)
        setCountWeek(_countWeek)
        setInProgress(false)
      })
  }

  useEffect(() => {
    const subscription = subscribeStats()
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (inProgress) {
    return <CircularProgress className={classes.progress} />
  }

  return (
    <Fade in>
      <main className={classes.root}>
        <SectionTitle
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

const useStyles = makeStyles(({ spacing }) => {
  return {
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10)
    },
    root: {
      display: 'grid',
      gridRowGap: px(spacing(2))
    },
    section: {
      display: 'grid',
      gridRowGap: px(spacing(1)),
      paddingLeft: spacing(2),
      paddingRight: spacing(2)
    }
  }
})

export default RouteStats
