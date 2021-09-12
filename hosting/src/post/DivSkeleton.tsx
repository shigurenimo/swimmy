import { Skeleton, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

export const DivSkeleton: FunctionComponent = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Skeleton variant={'text'} height={19} width={'20%'} />
      <Skeleton variant={'text'} height={22} />
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    root: {
      borderRadius: 0,
      display: 'grid',
      gridGap: spacing(0.5),
      paddingBottom: spacing(1.5),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(1.2),
    },
  }
})
