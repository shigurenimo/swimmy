import { Card, Theme } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

const CardPostSkeleton: FunctionComponent = () => {
  const classes = useStyles()

  return (
    <Card className={classes.card} elevation={0}>
      <Skeleton variant={'text'} height={19} width={'20%'} />
      <Skeleton variant={'text'} height={22} />
    </Card>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    card: {
      display: 'grid',
      gridGap: spacing(0.5),
      paddingBottom: spacing(1.5),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(1.2),
    },
  }
})

export default CardPostSkeleton
