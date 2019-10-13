import { Card, CardActionArea, CardMedia, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { Post } from '../../firestore/types/post'

type Props = { post: Post }

const CardImage: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles({})

  return (
    <Link to={`/threads/${post.id}`}>
      <Card>
        <CardActionArea className={classes.actionArea}>
          <CardMedia component={'img'} image={`${post.photoURLs[0]}=s400`} />
        </CardActionArea>
      </Card>
    </Link>
  )
}

const useStyles = makeStyles<Theme>({ actionArea: { width: `${100}%` } })

export default CardImage
