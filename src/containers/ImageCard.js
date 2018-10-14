import Card from '@material-ui/core/Card/Card'
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia/CardMedia'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component } from 'react'

class ImageCard extends Component<any, any> {
  state = {}

  render() {
    const { classes, post } = this.props

    return (
      <Card>
        <CardActionArea className={classes.actionArea}>
          <CardMedia
            component="img"
            alt={post.id}
            className={classes.media}
            image={post.photoURLs[0]}
          />
        </CardActionArea>
      </Card>
    )
  }
}

const styles = theme => ({
  root: {},
  actionArea: {
    width: '100%'
  },
  media: {}
})

export default withStyles(styles)(ImageCard)
