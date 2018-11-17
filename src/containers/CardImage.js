import Card from '@material-ui/core/Card/Card'
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia/CardMedia'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { Link } from 'react-router-dom'
import { pct } from '../libs/styles/pct'

class Component extends React.Component<any, any> {
  state = {}

  render() {
    const { classes, post } = this.props

    return (
      <Link to={`/threads/${post.id}`}>
        <Card>
          <CardActionArea className={classes.actionArea}>
            <CardMedia
              component="img"
              alt={post.id}
              image={post.photoURLs[0] + '=s400'}
            />
          </CardActionArea>
        </Card>
      </Link>
    )
  }
}

const styles = createStyles({
  actionArea: { width: pct(100) }
})

export const CardImage = withStyles(styles)(Component)
