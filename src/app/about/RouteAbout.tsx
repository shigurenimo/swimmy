import { Card, CardContent, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Header from 'app/shared/components/AppBarDefault'
import FragmentHead from 'app/shared/components/FragmentHead'
import { px } from 'app/shared/styles/px'
import { resetList } from 'app/shared/styles/resetList'
import React, { Fragment, FunctionComponent } from 'react'

const RouteAbout: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <Fragment>
      <FragmentHead title={'About'} />
      <Header />
      <main className={classes.root}>
        <Typography variant={'h5'}>About</Typography>
        <ul className={classes.cards}>
          <li>
            <Card>
              <CardContent>
                <Typography gutterBottom variant={'h6'} component={'h2'}>
                  Title
                </Typography>
                <Typography component="p">Description</Typography>
              </CardContent>
            </Card>
          </li>
        </ul>
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    cards: {
      ...resetList(),
      display: 'grid',
      gridRowGap: px(spacing(4)),
      margin: '0 auto',
      maxWidth: spacing(100)
    },
    root: {
      display: 'grid',
      gridRowGap: px(spacing(4)),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(4)
    }
  }
})

export default RouteAbout
