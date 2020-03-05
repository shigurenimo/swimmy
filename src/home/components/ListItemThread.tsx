import { ListItem, ListItemText, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { analytics } from 'firebase/app'
import React, { Fragment, FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { Post } from '../../firestore/types/post'
import { toDateText } from '../../text/toDateText'

type Props = {
  post: Post
  selected: boolean
}

const ListItemThread: FunctionComponent<Props> = ({ post, selected }) => {
  const classes = useStyles()

  const onClick = () => {
    analytics().logEvent('select_content', {
      content_id: post.id,
      content_type: 'thread',
    })
  }

  if (selected) {
    return (
      <ListItem disabled divider>
        <ListItemText
          className={classes.listItemText}
          primary={post.text}
          secondaryTypographyProps={{ className: classes.secondary }}
          secondary={
            <Fragment>
              <Typography className={classes.comment} variant={'caption'}>
                {`${post.replyPostCount}コメント`}
              </Typography>
              <Typography variant={'caption'}>
                {toDateText(post.updatedAt)}
              </Typography>
            </Fragment>
          }
        />
      </ListItem>
    )
  }

  return (
    <Link to={`/threads/${post.id}`} onClick={onClick}>
      <ListItem button divider>
        <ListItemText
          className={classes.listItemText}
          primary={post.text}
          secondaryTypographyProps={{ className: classes.secondary }}
          secondary={
            <Fragment>
              <Typography className={classes.comment} variant={'caption'}>
                {`${post.replyPostCount}コメント`}
              </Typography>
              <Typography variant={'caption'}>
                {toDateText(post.updatedAt)}
              </Typography>
            </Fragment>
          }
        />
      </ListItem>
    </Link>
  )
}

const useStyles = makeStyles<Theme>(({ spacing, palette }) => {
  return {
    comment: { color: palette.primary.dark, fontWeight: 'bold' },
    listItemText: { display: 'grid', gridGap: spacing(0.5) },
    secondary: {
      display: 'grid',
      gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
      justifyContent: 'space-between',
    },
  }
})

export default ListItemThread
