import Card from '@material-ui/core/Card/Card'
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia/CardMedia'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'

class Component extends React.Component<any, any> {
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
            image={post.photoURLs[0] + '=s400'}
          />
        </CardActionArea>
      </Card>
    )
  }
}

const styles = createStyles({
  root: {},
  actionArea: {
    width: '100%'
  },
  media: {}
})

export const ImageCard = withStyles(styles)(Component)
