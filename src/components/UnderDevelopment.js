import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import React from 'react'

const UnderDevelopment = ({ classes, Icon, title, description }) => (
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
    <Typography
      className={classes.description}
      align={'center'}
      variant={'body1'}
    >
      {description}
    </Typography>
  </div>
)

const styles = () => ({
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
  },
  description: {}
})

export default withStyles(styles)(UnderDevelopment)
