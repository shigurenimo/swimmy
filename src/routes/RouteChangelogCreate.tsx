import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import FormChangelogCreate from '../components/FormChangelogCreate'

const RouteChangelogCreate: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <FormChangelogCreate />
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      margin: 'auto',
      maxWidth: spacing.unit * 100,
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2,
      paddingTop: spacing.unit * 10
    }
  }
})

export default RouteChangelogCreate
