import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import React, { Component } from 'react'

class PageThreads extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography align={'center'}>
          このページはまだ利用できません。
        </Typography>
      </div>
    )
  }
}

const styles = () => ({
  root: {
    paddingTop: 160
  }
})

export default withStyles(styles)(PageThreads)
