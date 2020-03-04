import { Card, CardActionArea, CardMedia, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { analytics } from 'firebase/app'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { Post } from '../../firestore/types/post'

type Props = { post: Post }

const CardImage: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles()

  return (
    <Link
      to={`/threads/${post.id}`}
      onClick={() => {
        analytics().logEvent('select_content', {
          content_id: post.id,
          content_type: 'photo',
        })
      }}
    >
      <Card>
        <CardActionArea className={classes.actionArea}>
          <CardMedia component={'img'} image={`${post.photoURLs[0]}=c`} />
        </CardActionArea>
      </Card>
    </Link>
  )
}

const useStyles = makeStyles<Theme>({ actionArea: { width: `${100}%` } })

export default CardImage
