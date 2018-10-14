import withStyles from '@material-ui/core/styles/withStyles'
import Code from '@material-ui/icons/Code'
import React, { Component } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

class PageDevelopment extends Component<any, any> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <UnderDevelopment
          Icon={Code}
          title={'開発'}
          description={
            'Swをローカル環境で走らせる方法を確認できる機能を開発しています。'
          }
        />
      </div>
    )
  }
}

const styles = () => ({
  root: {
    paddingTop: 160
  }
})

export default withStyles(styles)(PageDevelopment)