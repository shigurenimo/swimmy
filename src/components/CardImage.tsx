import Card from '@material-ui/core/Card/Card'
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia/CardMedia'
import makeStyles from '@material-ui/styles/makeStyles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { pct } from '../libs/styles/pct'

interface Props {
  post: PostUi
}

const CardImage: FunctionComponent<Props> = props => {
  const { post } = props
  const classes = useStyles({})

  return (
    <Link to={`/threads/${post.id}`}>
      <Card>
        <CardActionArea className={classes.actionArea}>
          <CardMedia component="img" image={post.photoURLs[0] + '=s400'} />
        </CardActionArea>
      </Card>
    </Link>
  )
}

const useStyles = makeStyles({ actionArea: { width: pct(100) } })

export default CardImage
