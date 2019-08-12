import { Card, CardContent, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import Header from '../shared/components/AppBarDefault'
import DivLoading from '../shared/components/DivLoading'
import FragmentHead from '../shared/components/FragmentHead'
import { STATISTICS } from '../shared/firestore/constants/collection'
import { DESC } from '../shared/firestore/constants/order'
import { Statistic } from '../shared/firestore/types/statistic'
import { px } from '../shared/styles/px'

const RouteStats: FunctionComponent = () => {
  const [loading, setLoading] = useState(true)
  const [statistic, setStatistic] = useState<Statistic | null>(null)
  const classes = useStyles({})

  useEffect(() => {
    const subscription = collectionData<Statistic>(
      firestore()
        .collection(STATISTICS)
        .orderBy('createdAt', DESC)
        .limit(1)
    ).subscribe(statistics => {
      if (!statistics.length) {
        setLoading(false)
        return
      }
      const [statistic] = statistics
      setStatistic(statistic)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (statistic === null) {
    return null
  }

  return (
    <Fragment>
      <FragmentHead title={'集計データ'} />
      <Header />
      <main className={classes.root}>
        {!loading && (
          <Fragment>
            <section className={classes.section}>
              <Card>
                <CardContent style={{ paddingBottom: 16 }}>
                  <Typography>{'すべての投稿'}</Typography>
                  <Typography variant={'h4'}>{statistic.postCount}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent style={{ paddingBottom: 16 }}>
                  <Typography>{'コメント'}</Typography>
                  <Typography variant={'h4'}>
                    {statistic.responsePostCount}
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent style={{ paddingBottom: 16 }}>
                  <Typography>{'画像の投稿'}</Typography>
                  <Typography variant={'h4'}>
                    {statistic.imagePostCount}
                  </Typography>
                </CardContent>
              </Card>
            </section>
          </Fragment>
        )}
        {loading && <DivLoading />}
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    root: { display: 'grid', gridRowGap: px(spacing(2)) },
    section: {
      display: 'grid',
      gridRowGap: px(spacing(2)),
      marginLeft: spacing(2),
      marginRight: spacing(2)
    }
  }
})

export default RouteStats
