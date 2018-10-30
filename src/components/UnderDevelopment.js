import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import React from 'react'

const Component = ({ classes, Icon, title, description }) => {
  return (
    <div className={classes.root}>
      <Icon className={classes.icon} />
      <Typography
        className={classes.title}
        align={'center'}
        variant={'h6'}
        gutterBottom
      >
        {title}
      </Typography>
      <Typography align={'center'} variant={'body1'}>
        {description}
      </Typography>
    </div>
  )
}

const styles = createStyles({
  root: {
    paddingLeft: 12,
    paddingRight: 12
  },
  icon: {
    display: 'block',
    margin: 'auto',
    fontSize: 80
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold'
  }
})

export const UnderDevelopment = withStyles(styles)(Component)
