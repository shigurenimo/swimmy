import {
  Card,
  CardContent,
  Divider,
  Theme,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent } from 'react'
import AppBarDefault from '../core/AppBarDefault'
import DivLoading from '../layout/DivLoading'
import FragmentHead from '../web/FragmentHead'
import ToolbarDefault from '../layout/ToolbarDefault'
import { useStatistic } from './hooks/useStatistic'

const RouteStats: FunctionComponent = () => {
  const [statistic, loading] = useStatistic()

  const classes = useStyles()

  if (statistic === null) {
    return null
  }

  return (
    <Fragment>
      <FragmentHead title={'集計データ'} />
      <AppBarDefault />
      <ToolbarDefault />
      <main className={classes.root}>
        {statistic !== null && (
          <section className={classes.section}>
            <Divider />
            <Card>
              <CardContent style={{ paddingBottom: 16 }}>
                <Typography>{'すべての投稿'}</Typography>
                <Typography variant={'h4'}>{statistic.postCount}</Typography>
              </CardContent>
            </Card>
            <Divider />
            <Card>
              <CardContent style={{ paddingBottom: 16 }}>
                <Typography>{'コメント'}</Typography>
                <Typography variant={'h4'}>
                  {statistic.responsePostCount}
                </Typography>
              </CardContent>
            </Card>
            <Divider />
            <Card>
              <CardContent style={{ paddingBottom: 16 }}>
                <Typography>{'画像の投稿'}</Typography>
                <Typography variant={'h4'}>
                  {statistic.imagePostCount}
                </Typography>
              </CardContent>
            </Card>
          </section>
        )}
        {loading && <DivLoading />}
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    root: { display: 'grid' },
    section: { display: 'grid' },
  }
})

export default RouteStats
