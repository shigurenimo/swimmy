import { Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { px } from '../libs/styles/px'
import { resetList } from '../libs/styles/resetList'

const RouteAbout: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
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
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    cards: {
      ...resetList(),
      display: 'grid',
      gridRowGap: px(spacing.unit * 4),
      margin: '0 auto',
      maxWidth: spacing.unit * 100
    },
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 4),
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2,
      paddingTop: spacing.unit * 4
    }
  }
})

export default RouteAbout
